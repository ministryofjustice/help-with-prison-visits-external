$('form').submit(function (event) {
  $(this).children('input[type=submit]').prop('disabled', true)
  $(this).children('input[type=submit]').prop('value', 'Please wait...')
})
