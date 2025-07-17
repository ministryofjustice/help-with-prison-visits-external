$('#document').change(() => {
  const document = $('#document').val().replace(/\\/g, '/').replace(/.*\//, '')
  if (document) {
    $('#alternative').hide()
    $('#document-name').html(document).addClass('text-success')
    $('#document').hide()
    $('#label').hide()
    $('#remove-file-upload').show()
  }
})
