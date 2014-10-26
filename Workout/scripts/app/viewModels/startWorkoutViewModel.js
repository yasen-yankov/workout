var app = app || {};
app.models = app.models || {};

app.models.startWorkout = (function () {
    init = function (e) {
        _initTouchEvents(e);
    };
    
    var _initTouchEvents = function (e) {
        e.view.element.find(".settings-btn-js").kendoTouch({
            touchstart: _settingsBtnTapped
        });
    };
    
    var _settingsBtnTapped = function () {
        var transition = "overlay:up";
        
        app.mobileApp.navigate('views/settings.html', transition);
    };

    return {
        init: init
    };
}());