$.ajax({
    type: "POST",
    url: 'http://' + location.hostname + ':8081/auth/logout',
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      'Authorization': Cookies.get("token")
    }
  })
  .done(function (data) {
    Cookies.remove('refreshToken');
    Cookies.remove('token');
    window.location.href = '/';
  })
  .fail(function (jqXHR) {
    $('.is-3').hide();
    if (jqXHR.status === 401) {
      mess("Unauthorized");
      return;
    }
    mess('Oops, something went wrong');
  })

// ----- message
var message = $('#message');
function mess(msg) {
  message.show();
    $('#message-content').html(msg);
}
$('#message-hide').click(function() {
  message.hide();
});
