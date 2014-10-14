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

            workout = app.extensions.workout.sortExercisesByOrder(workout);
            
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