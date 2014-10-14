var app = app || {};
app.models = app.models || {};

app.models.learn = (function () {
    var learnViewModel = {
        title: 'Learn',
        workoutsDataSource: app.data.workouts,
        workoutSelected: function (e) {
            var transition = "slide";

            if (app.devicePlatform == mobilePlatforms.android) {
                transition = "none";
            }
            
            app.mobileApp.navigate('views/workout.html?uid=' + e.data.uid, transition);
        }
    }

    init = function (e) {
        kendo.bind(e.view.element, learnViewModel, kendo.mobile.ui);
    };

    return {
        init: init
    };
}());