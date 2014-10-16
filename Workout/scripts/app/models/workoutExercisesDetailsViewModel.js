var app = app || {};
app.models = app.models || {};

app.models.workoutExercisesDetails = (function () {
    var workoutExercisesViewModel = (function () {
        var workoutUid,
            exerciseUid,
            workout;

        var init = function (e) {
            workoutUid = e.view.params.workoutUid;

            workout = app.data.workouts.getByUid(workoutUid);

            if (workout.Exercises == null) {
                workout.Exercises = [];
            }

            if (workout.Exercises.length > 0 && typeof (workout.Exercises[0]) != 'object') {
                workout.Exercises = app.data.exercises.getByIds(workout.Exercises);
                workout = app.extensions.workout.sortExercisesByOrder(workout);
            }

            var ds = new kendo.data.DataSource({
                data: workout.Exercises
            });

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");

            exercisesScrollView.kendoMobileScrollView({
                dataSource: ds,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#exercisesDetailsTemplate").html())
            });
        };

        var show = function (e) {
            exerciseUid = e.view.params.exerciseUid;

            var startIndex = 0;

            for (i = 0; i < workout.Exercises.length; i++) {
                if (workout.Exercises[i].uid == exerciseUid) {
                    startIndex = i;
                    break;
                }
            }
            
            var exercisesScrollView = e.view.element.find("#exercises-scroll-view").data("kendoMobileScrollView");
            exercisesScrollView.refresh();
            exercisesScrollView.options.page = startIndex;
            exercisesScrollView.options.dataSource.page(startIndex);
        };

        return {
            init: init,
            show: show,
            workout: workout
        }
    }());

    return workoutExercisesViewModel;
}());