module.exports = function (status) {
  var forEdit = false
  if (status === 'PENDING' || status === 'REQUEST-INFORMATION' || status === 'REQUEST-INFO-PAYMENT') {
    forEdit = true
  }
  return forEdit
}
