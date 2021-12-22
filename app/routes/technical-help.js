const axios = require('axios')
const TechnicalHelp = require('../services/domain/technical-help')
const ValidationError = require('../services/errors/validation-error')
const config = require('../../config')
const log = require('../services/log')

module.exports = function (router) {
  router.get('/help', function (req, res) {
    return res.render('technical-help', {
    })
  })

  router.post('/help', function (req, res, next) {
    try {
      if (config.ZENDESK_ENABLED === 'true') {
        const technicalHelp = new TechnicalHelp(
          req.body.name,
          req.body.emailAddress,
          req.body.referenceNumber,
          req.body['date-of-claim-day'],
          req.body['date-of-claim-month'],
          req.body['date-of-claim-year'],
          req.body.issue
        )

        const formattedDate = technicalHelp.dateOfClaim ? `${req.body['date-of-claim-day']}-${req.body['date-of-claim-month']}-${req.body['date-of-claim-year']}` : ''

        let subjectText = 'Help With Prison Visits - Help'
        const tagText = ['HelpWithPrisonVisits']

        if (config.ZENDESK_TEST_ENVIRONMENT === 'true') {
          subjectText = 'Test: Help With Prison Visits - Help'
          tagText.push('Test')
        }

        const zendeskApiUrl = `${config.ZENDESK_API_URL}/api/v2/tickets.json`
        const credentials = `${config.ZENDESK_EMAIL_ADDRESS}/token:${config.ZENDESK_API_KEY}`
        const headers = {
          Authorization: 'Basic ' + Buffer.from(credentials).toString('base64')
        }

        const ticket = {
          ticket: {
            submitter_id: '114198238551',
            requester: {
              name: technicalHelp.name,
              email: technicalHelp.emailAddress,
              verified: true
            },
            subject: subjectText,
            comment: {
              body: `Reference number: ${technicalHelp.referenceNumber}\n\nDate of Claim: ${formattedDate}\n\n${technicalHelp.issue}`
            },
            tags: tagText
          }
        }

        return axios.post(zendeskApiUrl, ticket, { headers })
          .then(function (response) {
            if (response.status === 201) {
              log.info(`Zendesk ticket ${response.data.ticket.id} has been raised`)
            }

            return res.redirect('/')
          })
          .catch(function () {
            log.error(`Zendesk post failed. No ticket created for ref ${technicalHelp.referenceNumber}.`)
            return res.redirect('/')
          })
      } else {
        log.info('Zendesk not enabled. No ticket created.')
        return res.redirect('/')
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('technical-help', {
          errors: error.validationErrors,
          rating: req.body.rating,
          help: {
            name: req.body.name,
            emailAddress: req.body.emailAddress,
            referenceNumber: req.body.referenceNumber,
            'date-of-claim-day': req.body['date-of-claim-day'],
            'date-of-claim-month': req.body['date-of-claim-month'],
            'date-of-claim-year': req.body['date-of-claim-year'],
            issue: req.body.issue
          }
        })
      } else {
        next(error)
      }
    }
  })
}
