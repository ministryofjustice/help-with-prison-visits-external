const Feedback = require('../services/domain/feedback')
const insertTask = require('../services/data/insert-task')
const ValidationError = require('../services/errors/validation-error')
const TaskEnums = require('../constants/tasks-enum')

module.exports = router => {
  router.get('/feedback', (req, res) => {
    return res.render('feedback', {})
  })

  router.post('/feedback', (req, res, next) => {
    try {
      const feedback = new Feedback(req.body?.rating, req.body?.improvements, req.body?.emailAddress)
      insertTask(
        null,
        null,
        null,
        TaskEnums.FEEDBACK_SUBMITTED,
        `${feedback.rating}~~${feedback.improvements}~~${feedback.emailAddress}`,
      ).then(() => {
        return res.redirect('/start')
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('feedback', {
          errors: error.validationErrors,
          rating: req.body?.rating,
          improvements: req.body?.improvements,
          emailAddress: req.body?.emailAddress,
        })
      }
      next(error)
    }

    return null
  })
}
