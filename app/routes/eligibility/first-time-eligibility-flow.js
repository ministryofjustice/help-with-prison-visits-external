module.exports = function (router) {
  // Date of Birth
  router.get('/first-time', function (req, res, next) {
    res.render('eligibility/date-of-birth')
    next()
  })

  // TODO: Need age check here. If under 16 redirect to eligibility-fail. Add this to the validation logic for the page.
  router.post('/first-time', function (req, res, next) {
    res.redirect('/first-time/' + buildDOB(req))
    next()
  })

  // Prisoner-relationship
  router.get('/first-time/:dob', function (req, res, next) {
    var dob = req.params.dob
    res.render('eligibility/prisoner-relationship', { dob: dob })
    next()
  })

  // TODO: Split the reltionship values into an enum module.

  router.post('/first-time/:dob', function (req, res, next) {
    var relationship = req.body.relationship
    var dob = req.params.dob

    if (relationship === 'None of the above') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship)
    }
    next()
  })

  // TODO: Move journey assistance elsewhere in the flow.

  // Benefits
  router.get('/first-time/:dob/:relationship', function (req, res, next) {
    res.render('eligibility/benefits')
    next()
  })

  router.post('/benefits', function (req, res, next) {
    var benefit = req.body.benefit

    if (benefit === 'None of the above') {
      res.redirect('eligibility-fail')
    } else {
      res.redirect('benefits-on-behalf')
    }
    next()
  })
}

function buildDOB (req) {
  var day = req.body['dob-day']
  var month = req.body['dob-month']
  var year = req.body['dob-year']
  return day + '-' + month + '-' + year
}
