var app = (function (window) {

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

    }, false);

    // Initialize Everlive SDK
    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    var mobileApp = new kendo.mobile.Application(document.body, {

        transition: 'fade',

        skin: 'flat',

        initial: 'views/startWorkout.html'
    });

    return {
        mobileApp: mobileApp,
        everlive: el
    };
}(window));