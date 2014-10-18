var app = app || {};
app.models = app.models || {};

app.models.workout = (function () {
    var workoutUid,
        workout;

    var exerciseSelected = function (e) {
        var transition = "slide";

        if (app.devicePlatform === mobilePlatforms.android) {
            transition = "none";
        }

        app.mobileApp.navigate('views/workoutExercisesDetails.html?workoutUid=' + workout.uid + '&exerciseUid=' + e.data.uid, transition);
    };
    
    var startWorkout = function (e) {
        app.mobileApp.navigate('views/workoutInProgress.html?uid=' + e.data.uid);
    };

    var show = function (e) {
        workoutUid = e.view.params.uid;

        workout = app.data.workouts.getByUid(workoutUid);

        workout = app.extensions.workout.fetchExercises(workout);
        workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
        workout = app.extensions.workout.sortExercisesByOrder(workout);

        workout.exerciseSelected = exerciseSelected;
        workout.startWorkout = startWorkout;

        kendo.bind(e.view.element, workout, kendo.mobile.ui);
    };

    return {
        show: show,
        workout: workout
    };
}());