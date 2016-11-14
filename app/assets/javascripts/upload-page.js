$('#document').change(function () {
  var document = $('#document').val()
  if (document) {
    $('#alternative').hide()
    $('#document-name').html(document)
  }
})
