var app = app || {};

app.models = app.models || {};

app.models.workoutInProgress = (function () {
    var workoutInProgressViewModel = (function () {
        var workoutUid,
            _executableWorkout,
            _workoutExecutor,
            _exercisesScrollView;
        
        var init = function (e) {
            initTouchEvents(e);
        }
        
        var initTouchEvents = function (e) {
            e.view.element.find("#workoutInProgressWrapper").kendoTouch({
                tap: workoutInProgressWrapperTapped
            });
            
            e.view.element.find("#endWorkoutBtn").kendoTouch({
                tap: endWorkout
            });
        };

        var show = function (e) {
            workoutUid = e.view.params.uid;

            var workout = app.data.workouts.getByUid(workoutUid);
            workout = app.extensions.workout.fetchExercises(workout);
            workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
            workout = app.extensions.workout.sortExercisesByOrder(workout);
            
            _executableWorkout = new ExecutableWorkout(workout);
            debugger;

            var exercisesDataSource = new kendo.data.DataSource({
                data: _executableWorkout.exercises
            });

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");

            exercisesScrollView.kendoMobileScrollView({
                dataSource: exercisesDataSource,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#workoutInProgressExercisesDetailsTemplate").html()),
                changing: exercisesScrollViewChanging
            });

            _exercisesScrollView = exercisesScrollView.getKendoMobileScrollView();
            exercisesScrollViewDisableScrolling();

            setExerciseNumberInHeader(_exercisesScrollView.options.page + 1);

            kendo.bind(e.view.element, workoutInProgressViewModel, kendo.mobile.ui);

            _workoutExecutor = new workoutExecutor(_executableWorkout, exercisesScrollViewNext, setExerciseCountDownText);
            _workoutExecutor.begin();
        };

        var exercisesScrollViewDisableScrolling = function () {
            _exercisesScrollView.pane.userEvents.bind("start", function () {
                this.cancel();
            });
        };

        var exercisesScrollViewChanging = function (e) {
            var page = e.nextPage + 1;
            
            if (page % 2 !== 0) {
                page = Math.round(page / 2);
                setExerciseNumberInHeader(page);
            }
        };

        var exercisesScrollViewNext = function () {
            _exercisesScrollView.next();
        };

        var setExerciseNumberInHeader = function (number) {
            var text = number + " of " + _executableWorkout.initialNumberOfExercises;

            $("#workoutInProgress .header-text").text(text);
        };

        var endWorkout = function () {
            _workoutExecutor.end();
            app.mobileApp.navigate('views/startWorkout.html');
        };

        var setExerciseCountDownText = function (text) {
            $(".exercises-details .count-down-text").text(text);
        };
        
        var workoutInProgressWrapperTapped = function () {
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