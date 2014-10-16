var app = app || {};
app.models = app.models || {};

app.models.workout = (function () {
    var workoutUid,
        workout;

    var exerciseSelected = function (e) {
        var transition = "slide";

        if (app.devicePlatform == mobilePlatforms.android) {
            transition = "none";
        }

        app.mobileApp.navigate('views/workoutExercisesDetails.html?workoutUid=' + workout.uid + '&exerciseUid=' + e.data.uid, transition);
    };

    var show = function (e) {
        workoutUid = e.view.params.uid;

        workout = app.data.workouts.getByUid(workoutUid);

        if (workout.Exercises == null) {
            workout.Exercises = [];
        }

        if (workout.Exercises.length > 0 && typeof (workout.Exercises[0]) != 'object') {
            workout.Exercises = app.data.exercises.getByIds(workout.Exercises);
            workout = app.extensions.workout.sortExercisesByOrder(workout);
        }
        
        workout.exerciseSelected = exerciseSelected;

        kendo.bind(e.view.element, workout, kendo.mobile.ui);
    };

    return {
        show: show,
        workout: workout
    };
}());