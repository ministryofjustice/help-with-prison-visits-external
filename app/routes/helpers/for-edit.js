module.exports = function (status) {
  var forEdit = false
  if (status === 'PENDING' || status === 'REQUEST-INFORMATION') {
    forEdit = true
  }
  return forEdit
}
