$(function () {
  if(Cookies.get('token')) {
    window.location.href = '/dash';
  }

  // ----- Inputs
  function err(input, msg) {
    var eElem = input.next()[0];

    if (eElem) {
      eElem.remove();
    }

    if (msg) {
      input.addClass('is-danger');
      input.after('<span class="help is-danger">' + msg + '</span>');
    } else {
      input.removeClass('is-danger');
    }
  }

  var usernameInput = $('#username');

  function checkUsername() {
    if (!usernameInput.val().trim()) {
      err(usernameInput, 'A username is required');
      return false;
    }
    err(usernameInput, '');
    return true;
  }
  usernameInput.blur(function () {
    checkUsername();
  });
  usernameInput.focus(function () {
    err(usernameInput, '');
  });

  var passwordInput = $('#password');

  function checkPassword() {
    if (!passwordInput.val().trim()) {
      err(passwordInput, 'A password is required');
      return false;
    }
    err(passwordInput, '');
    return true;
  }
  passwordInput.blur(function () {
    checkPassword();
  });
  passwordInput.focus(function () {
    err(passwordInput, '');
  });

  // ----- message
  var message = $('#message');
  function mess(msg) {
    message.show();

    $('#message-content').html(msg);
  }
  $('#message-hide').click(function() {
    message.hide();
  });

  // ----- form
  var submit = $('#submit');
  $('#signin').submit(function (event) {
    event.preventDefault();

    if (!checkUsername() || !checkPassword()) {
      return;
    }

    submit.attr('disabled', true).addClass('is-loading');

    $.ajax({
        type: "POST",
        url: 'http://' + location.hostname + ':8081/auth',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          type: "bearer",
          username: usernameInput.val().trim(),
          password: passwordInput.val().trim()
        })
      })
      .done(function (data) {
        Cookies.set('token', data.token);
        Cookies.set('refreshToken', data.refreshToken);
        window.location.href = '/dash';
      })
      .fail(function (jqXHR) {
        if(jqXHR.status === 401) {
          mess('Bad username or password');
          return;
        }
        mess('Oops, something went wrong');
      })
      .always(function () {
        submit.attr('disabled', false).removeClass('is-loading');
      });
  });
});
