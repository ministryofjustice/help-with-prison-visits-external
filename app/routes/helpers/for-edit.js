module.exports = function (status, isAdvance) {
  var forEdit = false
  if (status === 'PENDING' || status === 'REQUEST-INFORMATION' || (status === 'APPROVED' && isAdvance)) {
    forEdit = true
  }
  return forEdit
}
