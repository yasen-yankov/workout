var app = app || {};

app.models = app.models || {};

app.models.workoutInProgress = (function (window) {
    var workoutInProgressViewModel = (function () {
        var _workoutUid,
            _circuits,
            _executableWorkout,
            _workoutExecutor,
            _exercisesScrollView,
            _exercisesDataSource,
            _exercisesScrollViewChanging,
            _workoutNavigation;
        
        var init = function (e) {
            _exercisesDataSource = new kendo.data.DataSource();

            var _exercisesScrollViewElement = e.view.element.find("#exercises-scroll-view");
            _exercisesScrollViewElement.kendoMobileScrollView({
                dataSource: _exercisesDataSource,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#workoutInProgressExercisesDetailsTemplate").html()),
                changing: _onExercisesScrollViewChanging,
                change: _onExercisesScrollViewChange
            });

            _exercisesScrollView = _exercisesScrollViewElement.getKendoMobileScrollView();
            _exercisesScrollViewDisableScrolling();
            
            var _workoutNavigationElement = e.view.element.find("#workoutNavigation");
            _workoutNavigationElement.kendoWorkoutNavigation({
                onNext: _nextExercise,
                onPrevious: _prevExercise,
                resumePauseToggleElement: $("#workoutInProgressWrapper"),
                onResume: _resume,
                onPause: _pause
            });
            
            _workoutNavigation = _workoutNavigationElement.getKendoWorkoutNavigation();
            
            
            _initTouchEvents();
        };

        var show = function (e) {
            _workoutUid = e.view.params.uid;
            _circuits = e.view.params.circuits ? e.view.params.circuits : 1;
            var skipInitialCountdown = e.view.params.skipInitialCountdown;

            var workout = app.data.workouts.getByUid(_workoutUid);
            workout = app.extensions.workout.fetchExercises(workout);
            workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
            workout = app.extensions.workout.sortExercisesByOrder(workout);
            
            _executableWorkout = new ExecutableWorkout(workout);

            _exercisesDataSource.data(_executableWorkout.exercises);

            _setExerciseNumberInHeader(_exercisesScrollView.options.page + 1);

            kendo.bind(e.view.element, workoutInProgressViewModel, kendo.mobile.ui);
            
            _workoutNavigation.refresh();
            
            _workoutExecutor = new WorkoutExecutor(_executableWorkout, _exercisesScrollViewNext, _exercisesScrollViewPrev, _workoutCompleted, _updateRemainingSeconds);
            
            if (skipInitialCountdown) {
                _workoutExecutor.begin();
            }
            else {
                _doInitialCountdown(function () {
                    _workoutExecutor.begin();
                });
            }
        };
        
        var _initTouchEvents = function () {
            $("#workoutInProgress #endWorkoutBtn").kendoTouch({
                tap: _endWorkout
            });
        };

        var _doInitialCountdown = function (onCompleted) {            
            var countdownModalView = $("#modalview-countdown");
            
            var viewModel = kendo.observable({
                secondsRemaining: 0
            });
            
            kendo.bind(countdownModalView, viewModel, kendo.mobile.ui);
            countdownModalView.kendoMobileModalView("open");
            
            var updateUI = function (remainingSeconds) {
                viewModel.set("secondsRemaining", remainingSeconds);
            }
            
            var closeModalView = function () {
                countdownModalView.kendoMobileModalView("close");
                onCompleted();
            }
            
            var countDownTimer = new CountDownTimer(3, updateUI, closeModalView);
            countDownTimer.start();
        };
        
        var _exercisesScrollViewDisableScrolling = function () {
            _exercisesScrollView.pane.userEvents.bind("start", function () {
                this.cancel();
            });
        };

        var _onExercisesScrollViewChanging = function (e) {
            _exercisesScrollViewChanging = true;
            
            var page = e.nextPage + 1;
            
            if (page % 2 !== 0) {
                page = Math.round(page / 2);
                _setExerciseNumberInHeader(page);
            }
        };
        
        var _onExercisesScrollViewChange = function () {
            _exercisesScrollViewChanging = false;
        };

        var _exercisesScrollViewNext = function () {
            _exercisesScrollView.next();
        };
        
        var _exercisesScrollViewPrev = function () {
            _exercisesScrollView.prev();
        };

        var _setExerciseNumberInHeader = function (number) {
            var text = number + " of " + _executableWorkout.initialNumberOfExercises;

            $("#workoutInProgress .header-text").text(text);
        };

        var _endWorkout = function () {
            _workoutExecutor.end();
            
            var transition = "slide:right";

            if (app.devicePlatform === mobilePlatforms.android) {
                transition = "none";
            }
            
            app.mobileApp.navigate('views/startWorkout.html', transition);
        };
        
        var _workoutCompleted = function () {
            var transition = "slide:left";
            
            _circuits--;
            if (_circuits === 0) {
                app.mobileApp.navigate('views/workoutCompleted.html?uid=' + _workoutUid, transition);
            }
            else {
                app.mobileApp.navigate('views/circuitCompleted.html?uid=' + _workoutUid + '&circuits=' + _circuits, transition);
            }
        };
        
        var _nextExercise = function () {
            if (_exercisesScrollViewChanging) {
                return;
            }
            
            _workoutExecutor.next();
        };
        
        var _prevExercise = function () {
            if (_exercisesScrollViewChanging) {
                return;
            }
            
            _workoutExecutor.prev();
        };
        
        var _resume = function () {
            _workoutExecutor.resume();
        };
        
        var _pause = function () {
            _workoutExecutor.pause();
        };

        var _updateRemainingSeconds = function (remainingSeconds) {
            _workoutNavigation.setCountdownSeconds(remainingSeconds);
        };

        return {
            init: init,
            show: show
        }
    }());

    return workoutInProgressViewModel;
}(window));