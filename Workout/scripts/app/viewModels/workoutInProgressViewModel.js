var app = app || {};

app.models = app.models || {};

app.models.workoutInProgress = (function (window) {
    var workoutInProgressViewModel = (function () {
        var _workoutUid,
            _executableWorkout,
            _workoutExecutor,
            _exercisesScrollView,
            _exercisesDataSource,
            _exercisesScrollViewChanging;
        
        var init = function (e) {
            _exercisesDataSource = new kendo.data.DataSource();

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");
            exercisesScrollView.kendoMobileScrollView({
                dataSource: _exercisesDataSource,
                contentHeight: "100%",
                enablePager: false,
                template: kendo.template($("#workoutInProgressExercisesDetailsTemplate").html()),
                changing: _onExercisesScrollViewChanging,
                change: _onExercisesScrollViewChange
            });

            _exercisesScrollView = exercisesScrollView.getKendoMobileScrollView();
            _exercisesScrollViewDisableScrolling();
            
            _initTouchEvents();
        };

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
            
            _setResumeWorkoutUI();
            
            _doInitialCountdown(function () {
                _workoutExecutor = new WorkoutExecutor(_executableWorkout, _exercisesScrollViewNext, _exercisesScrollViewPrev, _workoutCompleted, _updateRemainingSeconds);
                _workoutExecutor.begin();
            });
        };
        
        var _initTouchEvents = function () {
            $("#workoutInProgressWrapper").kendoTouch({
                touchstart: _workoutInProgressWrapperTapped
            });

            $("#endWorkoutBtn").kendoTouch({
                tap: _endWorkout
            });
            
            $(".next-exercise-btn").kendoTouch({
                touchstart: _nextExercise
            });
            
            $(".prev-exercise-btn").kendoTouch({
                touchstart: _prevExercise
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
            
            app.mobileApp.navigate('views/workoutCompleted.html?uid=' + _workoutUid, transition);
        };
        
        var _nextExercise = function () {
            if (_exercisesScrollViewChanging) {
                return;
            }
            
            _workoutExecutor.next();
            
            if (_workoutExecutor.isPaused()) {
                _setPauseWorkoutUI();
            }
        };
        
        var _prevExercise = function () {
            if (_exercisesScrollViewChanging) {
                return;
            }
            
            _workoutExecutor.prev();
            
            if (_workoutExecutor.isPaused()) {
                _setPauseWorkoutUI();
            }
        };

        var _updateRemainingSeconds = function (remainingSeconds) {
            if (remainingSeconds <= 3 && remainingSeconds > 0) {
                navigator.notification.vibrate(1000);
            }
            
            var minutes = Math.floor(remainingSeconds / 60);
            var seconds = remainingSeconds - minutes * 60;
            var secondsString = seconds + "";

            if (secondsString.length < 2) {
                secondsString = "0" + secondsString;
            }

            var text = minutes + ":" + secondsString;

            _setExerciseCountDownText(text);
        }

        var _setExerciseCountDownText = function (text) {
            $(".count-down-text").text(text);
        };
        
        var _workoutInProgressWrapperTapped = function (e) {
            if (e.touch.initialTouch.className.indexOf("next-exercise-btn") > -1 ||
                e.touch.initialTouch.parentElement.className.indexOf("next-exercise-btn") > -1 || 
                e.touch.initialTouch.className.indexOf("prev-exercise-btn") > -1 ||
                e.touch.initialTouch.parentElement.className.indexOf("prev-exercise-btn") > -1) {
                return;
            }
            
            if (_workoutExecutor.isPaused()) {
                _setResumeWorkoutUI();
                _workoutExecutor.resume();
            }
            else {
                _setPauseWorkoutUI();
                _workoutExecutor.pause();
            }
        };
        
        var _setResumeWorkoutUI = function () {
            $(".count-down-text").css("opacity", "1");
            $(".next-exercise-btn").hide();
            $(".prev-exercise-btn").hide();
        };
        
        var _setPauseWorkoutUI = function () {
            $(".count-down-text").css("opacity", "0.3");
            $(".next-exercise-btn").show();
            $(".prev-exercise-btn").show();
        };

        return {
            init: init,
            show: show
        }
    }());

    return workoutInProgressViewModel;
}(window));