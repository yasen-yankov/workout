var app = app || {};
app.models = app.models || {};

app.models.workout = (function () {
    var workoutUid,
        workout;

    var show = function (e) {
        workoutUid = e.view.params.uid;

        workout = app.data.workouts.getByUid(workoutUid);

        workout = app.extensions.workout.fetchExercises(workout);
        workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
        workout = app.extensions.workout.sortExercisesByOrder(workout);

        kendo.bind(e.view.element, workout, kendo.mobile.ui);

        initTouchEvents(e);
    };

    var initTouchEvents = function (e) {
        e.view.element.find("#exerciseList li a").kendoTouch({
            tap: exerciseTapped
        });

        e.view.element.find("#chooseWorkoutBtn").kendoTouch({
            touchstart: chooseWorkoutTapped
        });
    };

    var exerciseTapped = function (e) {
        var transition = "slide";

        if (app.devicePlatform === mobilePlatforms.android) {
            transition = "none";
        }

        app.mobileApp.navigate('views/workoutExercisesDetails.html?workoutUid=' + workout.uid + '&exerciseUid=' + e.sender.element.data("uid"), transition);
    };

    var chooseWorkoutTapped = function () {
        app.mobileApp.navigate('views/startWorkout.html?uid=' + workoutUid);
    };

    return {
        show: show,
        workout: workout
    };
}());