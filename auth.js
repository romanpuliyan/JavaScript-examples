$(document).ready(function() {
    
    // show form restore password
    $(".remindPasswordButton").on("click", function(e) {
        e.preventDefault();

        $(".popup-exit").slideUp(600);

        $(".popups-remind-password")
            .bPopup({
                onClose: function() {
                    closePopup($(this));
                }
            });
    });

    // Submit login form
    $(".login-form").on("submit", function(e) {
        e.preventDefault();

        var form     = $(this);
        var action   = $(this).attr("action");
        var formData = $(this).serialize();

        $.ajax({
            url: action,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success : function(response) {

                if(response.redirect) {
                    window.location.href = response.redirect;
                }

                if(response.message) {
                    if(response.message.validate) {

                        // Clear old errors
                        clearErrors(form);

                        // Show new errors
                        $.each(response.message.validate, function(inputName, error) {
                            showErrors(form, inputName, error);
                        });
                    }
                    else if(response.redError == true) {
                        showErrorJsMessage(response.message);

                        $(".sendConfirm").on("click", function(e) {
                            e.preventDefault();

                            var href = $(this).attr("href");
                            $.ajax({
                                url: href,
                                type: 'POST',
                                data: formData,
                                dataType: 'json',
                                success : function(response) {
                                    if(response.message) {
                                        hideErrorJsMessage();
                                        showSuccessJsMessage(response.message);
                                    }
                                    else {
                                        showErrorJsMessage('Произошла ошибка');
                                    }
                                }
                            });
                        });
                    }
                    else {

                        // Clear old errors
                        clearErrors(form);

                        // Error text
                        $("input[name='password']")
                            .parents(".lb_wrap")
                            .siblings("p")
                            .text(response.message);
                    }
                }
            }
        });
    });

    // Restore password form submit
    $(".remindPasswordForm").on("submit", function(e) {
        e.preventDefault();

        var form     = $(this);
        var action   = $(this).attr("action");
        var formData = $(this).serialize();

        $.ajax({
            url: action,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {

                if(response.message) {
                    if(response.message.validate) {

                        // Clear old errors
                        clearErrors(form);

                        // Show new errors
                        $.each(response.message.validate, function(inputName, error) {
                            showErrors(form, inputName, error);
                        });
                    }
                    else if(response.message.success) {
                        $(".popups-remind-password")
                            .bPopup()
                            .close();

                        closePopup($(".popups-remind-password"));
                        showSuccessJsMessage(response.message.success);
                    }
                }
            }
        });
    });
});
