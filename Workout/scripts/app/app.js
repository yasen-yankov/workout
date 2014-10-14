var app = (function (window) {
    var mobileApp,
        devicePlatform,
        mobileAppSettings = {
            transition: 'fade',
            skin: 'flat',
            initial: 'views/startWorkout.html'
        };

    document.addEventListener('deviceready', function () {
        devicePlatform = device.platform;

        if (devicePlatform == "Android") {
            mobileAppSettings.useNativeScrolling = true;
            mobileAppSettings.transition = "none";
        }

        app.mobileApp = new kendo.mobile.Application(document.body, mobileAppSettings);

        navigator.splashscreen.hide();
    }, false);

    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    return {
        mobileApp: mobileApp,
        everlive: el
    };
}(window));