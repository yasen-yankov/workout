var app = (function (window) {
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });
    
    var mobileAppSettings = {
        transition: 'fade',
        skin: 'flat',
        initial: 'views/startWorkout.html'
    };
    
    var devicePlatform = device.platform;
    
    if (devicePlatform == "Android") {
        mobileAppSettings.useNativeScrolling = true;
        mobileAppSettings.transition = "none";
    }
    
    var mobileApp = new kendo.mobile.Application(document.body, mobileAppSettings);

    return {
        mobileApp: mobileApp,
        everlive: el
    };
}(window));