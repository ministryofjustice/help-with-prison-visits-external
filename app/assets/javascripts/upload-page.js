$('#document').change(function () {
  var document = $('#document').val().replace(/\\/g, '/').replace(/.*\//, '')
  if (document) {
    $('#alternative').hide()
    $('#document-name').html(document).addClass('text-success')
    $('#choose-file').hide()
    $('#label').hide()
    $('#remove-file-upload').show()
  }

  $('.error-summary').hide()
})
