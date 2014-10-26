var app = app || {};
app.models = app.models || {};

app.models.workoutCompleted = (function () {
    init = function (e) {
        _initTouchEvents(e);
    };
    
    var _initTouchEvents = function (e) {
        e.view.element.find("#workoutDoneBtn").kendoTouch({
            touchstart: _workoutDoneBtnTapped
        });
    };
    
    var _workoutDoneBtnTapped = function () {
        var transition = "slide:right";

        if (app.devicePlatform === mobilePlatforms.android) {
            transition = "none";
        }
        
        app.mobileApp.navigate('views/startWorkout.html', transition);
    };

    return {
        init: init
    };
}());