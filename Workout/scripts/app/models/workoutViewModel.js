var app = app || {};
app.models = app.models || {};

app.models.workout = (function () {
    var workoutViewModel = (function () {
        var workoutUid,
            workout;

        var init = function (e) {

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

            kendo.bind(e.view.element, workout, kendo.mobile.ui);
        };

        return {
            init: init,
            show: show,
            workout: workout
        }
    }());

    return workoutViewModel;
}());