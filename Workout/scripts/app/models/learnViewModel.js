var app = app || {};
app.models = app.models || {};

app.models.learn = (function () {
    var learnViewModel = {
        title: 'Learn',
        ds: app.data.workouts,
        workoutSelected: function (e) {
            app.mobileApp.navigate('views/workout.html?uid=' + e.data.uid, "slide");
        }
    }
    
    return learnViewModel;
}());