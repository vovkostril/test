/*eslint-disable no-undef*/
$(function() {

    //clear
    $('post-form.input, #post-body').on('focus', function() {
        $('p.error').remove();
        $('input, div').removeClass('error');
    });


    //publish-button

    $('.publish-button').on('click', function(e) {
        e.preventDefault();

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').val() //html takes div
        };


        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/post/add'
        }).done(function(data) {
            if (!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>');

                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('#post' + item).addClass('error');
                    });
                }
            } else {
                //$('.login h2').after('<p class="success">FINALLY!</p>');
                $(location).attr('href', '/');
            }
        });

    });
});