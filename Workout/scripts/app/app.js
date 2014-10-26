var app = (function (window) {
    var mobileApp,
        devicePlatform,
        mobileAppSettings = {
            transition: 'slide',
            skin: 'flat',
            initial: 'views/startWorkout.html'
        };

    document.addEventListener('deviceready', function () {
        app.devicePlatform = device.platform;

        if (app.devicePlatform === mobilePlatforms.android) {
            //mobileAppSettings.transition = "none";
        }

        if (app.devicePlatform === mobilePlatforms.windows) {
            StatusBar.hide();
            mobileAppSettings.statusBarStyle = "hidden";
        }

        app.mobileApp = new kendo.mobile.Application(document.body, mobileAppSettings);

        $("body").show();
        navigator.splashscreen.hide();
    }, false);

    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    return {
        mobileApp: mobileApp,
        devicePlatform: devicePlatform,
        everlive: el
    };
}(window));