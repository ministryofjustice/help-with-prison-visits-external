const TechnicalHelp = require('../services/domain/technical-help')
const ValidationError = require('../services/errors/validation-error')
const Zendesk = require('zendesk-node-api')
const config = require('../../config')

function createTicket ({ name, emailAddress, issue }) {
  let subjectText = 'Help With Prison Visits - Help'
  let tagText = ['HelpWithPrisonVisits']

  if (config.ZENDESK_ENABLED === 'true') {
    const zendesk = new Zendesk({
      url: config.ZENDESK_API_URL,
      email: config.ZENDESK_EMAIL_ADDRESS,
      token: config.ZENDESK_API_KEY
    })

    if (config.ZENDESK_TEST_ENVIRONMENT === 'true') {
      subjectText = 'Test: Help With Prison Visits - Help'
      tagText = ['HelpWithPrisonVisits', 'Test']
    }

    return zendesk.tickets.create({
      submitter_id: '114198238551',
      requester: {
        name,
        email: emailAddress,
        verified: true
      },
      subject: subjectText,
      comment: {
        body: issue
      },
      tags: tagText
    }).then(function (result) {
      console.log('Zendesk ticket, ' + result.ticket.id + ' has been raised')
    })
  } else {
    console.log('Zendesk not implemented in development environments.')
    return Promise.resolve()
  }
}

module.exports = function (router) {
  router.get('/help', function (req, res) {
    return res.render('technical-help', {
    })
  })

  router.post('/help', function (req, res, next) {
    try {
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

      createTicket({
        name: technicalHelp.name,
        emailAddress: technicalHelp.emailAddress,
        issue: `Reference number: ${technicalHelp.referenceNumber}\n\nDate of Claim: ${formattedDate}\n\n${technicalHelp.issue}`
      })
        .then(function () {
          return res.redirect('/')
        })
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
