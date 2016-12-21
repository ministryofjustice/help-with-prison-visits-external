const Feedback = require('../services/domain/feedback')
const insertTask = require('../services/data/insert-task')
const ValidationError = require('../services/errors/validation-error')
const TaskEnums = require('../constants/tasks-enum')

module.exports = function (router) {
  router.get('/feedback', function (req, res) {
    return res.render('feedback', {
    })
  })

  router.post('/feedback', function (req, res, next) {
    try {
      var feedback = new Feedback(req.body.rating, req.body.improvements)
      insertTask(null, null, null, TaskEnums.FEEDBACK_SUBMITTED, `${feedback.rating}~~${feedback.improvements}`)
        .then(function () {
          return res.redirect('/')
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('feedback', {
          errors: error.validationErrors,
          rating: req.body.rating,
          improvements: req.body.improvements
        })
      } else {
        next(error)
      }
    }
  })
}
