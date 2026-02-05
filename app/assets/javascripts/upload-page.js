$('#document').on('change', function () {
  const document = $('#document').val().replace(/\\/g, '/').replace(/.*\//, '')
  if (document) {
    $('#document-name').html(document).addClass('text-success')
    $('#alternative,#document,#label').hide()
    $('#remove-file-upload').show()
  }
})
