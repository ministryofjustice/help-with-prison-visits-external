const TechnicalHelp = require('../services/domain/technical-help')
const insertTask = require('../services/data/insert-task')
const ValidationError = require('../services/errors/validation-error')
const TaskEnums = require('../constants/tasks-enum')

module.exports = function (router) {
  router.get('/help', function (req, res) {
    return res.render('technical-help', {
    })
  })

  router.post('/help', function (req, res, next) {
    try {
      var technicalHelp = new TechnicalHelp(
        req.body.name,
        req.body.emailAddress,
        req.body.referenceNumber,
        req.body['date-of-claim-day'],
        req.body['date-of-claim-month'],
        req.body['date-of-claim-year'],
        req.body.issue
      )

      insertTask(null, null, null, TaskEnums.TECHNICAL_HELP_SUBMITTED, `${technicalHelp.name}~~${technicalHelp.emailAddress}~~${technicalHelp.referenceNumber}~~${technicalHelp.dateOfClaim}~~${technicalHelp.issue}`)
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
