const ReferenceRecovery = require('../services/domain/reference-recovery')
const insertTask = require('../services/data/insert-task')
const ValidationError = require('../services/errors/validation-error')
const TaskEnums = require('../constants/tasks-enum')

module.exports = router => {
  router.get('/reference-recovery', (req, res) => {
    return res.render('reference-recovery', {
    })
  })

  router.post('/reference-recovery', (req, res, next) => {
    try {
      const referenceRecovery = new ReferenceRecovery(req.body?.EmailAddress, req.body?.PrisonerNumber)
      insertTask(null, null, null, TaskEnums.REFERENCE_RECOVERY, `${referenceRecovery.EmailAddress}~~${referenceRecovery.PrisonerNumber}`)
        .then(() => {
          return res.redirect('/start-already-registered?recovery=true')
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('reference-recovery', {
          errors: error.validationErrors,
          recovery: { EmailAddress: req.body?.EmailAddress, PrisonerNumber: req.body?.PrisonerNumber }
        })
      } else {
        next(error)
      }
    }
  })
}
