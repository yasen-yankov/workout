var app = (function (window) {
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

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