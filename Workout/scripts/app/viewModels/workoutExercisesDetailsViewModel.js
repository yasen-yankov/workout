var app = app || {};
app.models = app.models || {};

app.models.workoutExercisesDetails = (function () {
    var workoutExercisesViewModel = (function () {
        var _workoutUid,
            _exerciseUid,
            _workout,
            _exercisesDataSource,
            _exercisesScrollView;
        
        var init = function (e) {
            _exercisesDataSource = new kendo.data.DataSource();

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");
            exercisesScrollView.kendoMobileScrollView({
                dataSource: _exercisesDataSource,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#exercisesDetailsTemplate").html()),
                changing: _exercisesScrollViewChanging
            });
            
            _exercisesScrollView = exercisesScrollView.getKendoMobileScrollView();
            
            kendo.bind(e.view.element, workoutExercisesViewModel, kendo.mobile.ui);
        };

        var show = function (e) {
            _exerciseUid = e.view.params.exerciseUid;
            _workoutUid = e.view.params.workoutUid;

            _workout = app.data.workouts.getByUid(_workoutUid);
            _workout = app.extensions.workout.fetchExercises(_workout);
            _workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(_workout.Exercises);
            _workout = app.extensions.workout.sortExercisesByOrder(_workout);
            
            _exercisesDataSource.data(_workout.Exercises);

            var startIndex = 0;

            for (i = 0; i < _workout.Exercises.length; i++) {
                if (_workout.Exercises[i].uid === _exerciseUid) {
                    startIndex = i;
                    break;
                }
            }

            _exercisesScrollView.options.page = startIndex;
            _exercisesScrollView.options.dataSource.page(startIndex);
            
            _setExerciseNumberInHeader(startIndex + 1);
        };
        
        var _exercisesScrollViewChanging = function (e) {
            _setExerciseNumberInHeader(e.nextPage + 1);
        };
        
        var _setExerciseNumberInHeader = function (number) {
            var total = _workout.Exercises.length,
                text = number + " of " + total;
            
            $("#workoutExercisesDetails .header-text").text(text);
        };

        return {
            init: init,
            show: show
        }
    }());

    return workoutExercisesViewModel;
}());