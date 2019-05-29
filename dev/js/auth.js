/*eslint-disable no-undef*/
$(function() {
    //forms hide to login

    //clear
    $('form.login.input, form.register.input').on('focus', function() {
        $('p.error').remove();
        $('input').removeClass('error');
    });

    //register
    $('.create-button').on('click', function(e) {
        e.preventDefault();

        $('input').val('');
        $('p.error').remove();
        $('input').removeClass('error');

        var data = {
            name: $('#create-login').val(),
            password: $('#create-password').val()
        };

        //console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/create'
        }).done(function(data) {
            if (!data.ok) {
                $('.create h2').after('<p class="error">' + data.error + '</p>');

                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                //$('.create h2').after('<p class="success">FINALLY!</p>');
                $(location).attr('href', '/');
            }
        });
    });

    //login
    $('.login-button').on('click', function(e) {
        e.preventDefault();

        //$('input').val('');
        $('p.error').remove();
        $('input').removeClass('error');

        var data = {
            name: $('#login-login').val(),
            password: $('#login-password').val()
        };

        //console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/login'
        }).done(function(data) {
            if (!data.ok) {
                $('.login h2').after('<p class="error">' + data.error + '</p>');

                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                //$('.login h2').after('<p class="success">FINALLY!</p>');
                $(location).attr('href', '/');
            }
        });
    });

});