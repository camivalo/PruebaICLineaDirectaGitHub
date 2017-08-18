jQuery.ajaxSetup({cache: true});

window.fbAsyncInit = function () {
    FB.init({
        //appId: '439203026436840',  PD
        appId: '1862230804037492',
        status: true,
        cookie: true,
        xfbml: true,
        extendPermissions: 'public_profile,email,friends,user_birthday',
        version: 'v2.9'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var objSocial = {
    //Configuracion API Facebook
    fOpenFacebook: function (share) {
        FB.ui({
            method: 'share',
            hashtag: '#PCFKLovers',
            mobile_iframe: true,
            href: share
        }, function (response) {
        });
    },
    loginFacebook: function () {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }
};