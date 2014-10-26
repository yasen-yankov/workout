var app = app || {};
app.models = app.models || {};

app.models.learn = (function () {
    var learnViewModel = {
        title: 'Learn',
        workoutsDataSource: app.data.workouts
    }

    init = function (e) {
        kendo.bind(e.view.element, learnViewModel, kendo.mobile.ui);
        initTouchEvents(e);
    };
    
    var initTouchEvents = function (e) {
        e.view.element.find("#workouts-list li a").kendoTouch({
            tap: workoutTapped
        });
    };
    
    var workoutTapped = function (e) {
        var transition = "slide";

        if (app.devicePlatform === mobilePlatforms.android) {
            transition = "none";
        }
        
        app.mobileApp.navigate('views/workout.html?uid=' + e.sender.element.data("uid"), transition);
    };

    return {
        init: init
    };
}());