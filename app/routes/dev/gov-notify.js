// TODO remove 'notifications-node-client' from package.json when dev route removed
const NotifyClient = require('notifications-node-client').NotifyClient

module.exports = function (router) {
  router.get('/dev-gov-notify', function (req, res) {
    return res.render('dev/gov-notify', {
      reference: 'APVS15341'
    })
  })

  router.post('/dev-gov-notify', function (req, res) {
    // using old style of url/clientid/apikey, this will be replaced in future with single constructor key arg
    var notifyClient = new NotifyClient(
      'https://api.notifications.service.gov.uk',
      '11030d6a-c042-4857-aa68-99f0c7fa9352',
      process.env.APVS_NOTIFY_API_KEY // API Key
    )
    var reference = req.body.reference
    var personalisation = {reference: reference}

    if (req.body.sendemail) {
      var emailAddress = req.body.email
      var emailTemplateId = '508b23b3-3f1c-45c2-bdc7-db90e3fae8b0' // comes from Notify site
      notifyClient.sendEmail(emailTemplateId, emailAddress, personalisation)
    } else {
      var phoneNumber = req.body.phone
      var textTemplateId = 'adf6c0bf-513a-4fe4-8023-0ae4ab55e1a1'
      notifyClient.sendSms(textTemplateId, phoneNumber, personalisation)
    }

    return res.render('dev/gov-notify', {
      reference: reference,
      email: req.body.email,
      phone: req.body.phone,
      sent: true})
  })
}
