var app = app || {};

app.models = app.models || {};

app.models.workoutInProgress = (function () {
    var workoutInProgressViewModel = (function () {
        var workoutUid,
            _numberOfExercises,
            _workoutExecutor,
            _exercisesScrollView;

        var show = function (e) {
            workoutUid = e.view.params.uid;

            var workout = app.data.workouts.getByUid(workoutUid);

            workout = app.extensions.workout.fetchExercises(workout);
            workout.Exercises = app.extensions.exercise.fetchAllBase64ImagesForMultipleItems(workout.Exercises);
            workout = app.extensions.workout.sortExercisesByOrder(workout);
            _numberOfExercises = workout.Exercises.length;
            
            var workoutToBind = app.extensions.workout.addRestsBetweenExercises(workout);

            var ds = new kendo.data.DataSource({
                                                   data: workoutToBind.Exercises
                                               });

            var exercisesScrollView = e.view.element.find("#exercises-scroll-view");

            exercisesScrollView.kendoMobileScrollView({
                                                          dataSource: ds,
                                                          contentHeight: "100%",
                                                          enablePager: false,
                                                          template: kendo.template($("#exercisesDetailsTemplate").html()),
                                                          changing: exercisesScrollViewChanging
                                                      });

            _exercisesScrollView = exercisesScrollView.getKendoMobileScrollView();
            exercisesScrollViewDisableScrolling();

            setExerciseNumberInHeader(_exercisesScrollView.options.page + 1);

            kendo.bind(e.view.element, workoutInProgressViewModel, kendo.mobile.ui);

            _workoutExecutor = new workoutExecutor();
            _workoutExecutor.initialize(workout, exercisesScrollViewPrev, exercisesScrollViewNext, setExerciseCountDownText);
            _workoutExecutor.begin();
        };

        var exercisesScrollViewDisableScrolling = function () {
            _exercisesScrollView.pane.userEvents.bind("start", function () {
                this.cancel();
            });
        };
        
        var exercisesScrollViewEnableScrolling = function () {
            _exercisesScrollView.pane.userEvents.unbind("start", function () {
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

        var exercisesScrollViewPrev = function () {
            _exercisesScrollView.prev();
        };

        var setExerciseNumberInHeader = function (number) {
            var text = number + " of " + _numberOfExercises;

            $("#workoutInProgress .header-text").text(text);
        };

        var endWorkout = function () {
            _workoutExecutor.end();
            app.mobileApp.navigate('views/startWorkout.html');
        };

        var setExerciseCountDownText = function (text) {
            $(".exercises-details .count-down-text").text(text);
        };
        
        var containerClick = function (e) {
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
            show: show,
            endWorkout: endWorkout,
            containerClick: containerClick
        }
    }());

    return workoutInProgressViewModel;
}());