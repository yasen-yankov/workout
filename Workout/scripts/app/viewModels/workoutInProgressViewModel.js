var app = app || {};

app.models = app.models || {};

app.models.workoutInProgress = (function () {
    var workoutInProgressViewModel = (function () {
        var _workoutUid,
            _executableWorkout,
            _workoutExecutor,
            _exercisesScrollView,
            _exercisesDataSource;
        
        var init = function (e) {
            _initTouchEvents(e);
            
            _exercisesDataSource = new kendo.data.DataSource();

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");
            exercisesScrollView.kendoMobileScrollView({
                dataSource: _exercisesDataSource,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#workoutInProgressExercisesDetailsTemplate").html()),
                changing: _exercisesScrollViewChanging
            });

            _exercisesScrollView = exercisesScrollView.getKendoMobileScrollView();
            _exercisesScrollViewDisableScrolling();
        }

        var show = function (e) {
            _workoutUid = e.view.params.uid;

            var workout = app.data.workouts.getByUid(_workoutUid);
            workout = app.extensions.workout.fetchExercises(workout);
            workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
            workout = app.extensions.workout.sortExercisesByOrder(workout);
            
            _executableWorkout = new ExecutableWorkout(workout);

            _exercisesDataSource.data(_executableWorkout.exercises);

            _setExerciseNumberInHeader(_exercisesScrollView.options.page + 1);

            kendo.bind(e.view.element, workoutInProgressViewModel, kendo.mobile.ui);

            _workoutExecutor = new WorkoutExecutor(_executableWorkout, _exercisesScrollViewNext, _setExerciseCountDownText);
            _workoutExecutor.begin();
        };
        
        var _initTouchEvents = function (e) {
            e.view.element.find("#workoutInProgressWrapper").kendoTouch({
                tap: _workoutInProgressWrapperTapped
            });

            e.view.element.find("#endWorkoutBtn").kendoTouch({
                tap: _endWorkout
            });
        };

        var _exercisesScrollViewDisableScrolling = function () {
            _exercisesScrollView.pane.userEvents.bind("start", function () {
                this.cancel();
            });
        };

        var _exercisesScrollViewChanging = function (e) {
            var page = e.nextPage + 1;
            
            if (page % 2 !== 0) {
                page = Math.round(page / 2);
                _setExerciseNumberInHeader(page);
            }
        };

        var _exercisesScrollViewNext = function () {
            _exercisesScrollView.next();
        };

        var _setExerciseNumberInHeader = function (number) {
            var text = number + " of " + _executableWorkout.initialNumberOfExercises;

            $("#workoutInProgress .header-text").text(text);
        };

        var _endWorkout = function () {
            _workoutExecutor.end();
            app.mobileApp.navigate('views/startWorkout.html');
        };

        var _setExerciseCountDownText = function (text) {
            $(".exercises-details .count-down-text").text(text);
        };
        
        var _workoutInProgressWrapperTapped = function () {
            if (_workoutExecutor.isPaused()) {
                _workoutExecutor.resume();
                $(".exercises-details .count-down-text").css("opacity", "1");
            }
            else {
                $(".exercises-details .count-down-text").css("opacity", "0.3");
                _workoutExecutor.pause();
            }
        };

        return {
            init: init,
            show: show
        }
    }());

    return workoutInProgressViewModel;
}());