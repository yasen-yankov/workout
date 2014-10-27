var app = app || {};
app.models = app.models || {};

app.models.startWorkout = (function () {
    var _workoutUid;
    
    var startWorkoutViewModel = {
        workoutId: '',
        workoutName: '',
        circuits: 1
    }
    
    init = function (e) {
        _initTouchEvents(e);
    };
    
    var show = function (e) {
        if (!_workoutUid) {
            if (e.view.params.uid) {
                _workoutUid = e.view.params.uid;
            }
            else {
                return;
            }
        }
        
        var workout = app.data.workouts.getByUid(_workoutUid);
        
        startWorkoutViewModel.workoutId = workout.Id;
        startWorkoutViewModel.workoutName = workout.Name;
        
        kendo.bind(e.view.element, startWorkoutViewModel, kendo.mobile.ui);
    };
    
    var _initTouchEvents = function (e) {
        e.view.element.find(".settings-btn-js").kendoTouch({
            touchstart: _settingsBtnTapped
        });
        
        e.view.element.find(".start-workout-btn-js").kendoTouch({
            touchstart: _startWorkoutBtnTapped
        });
    };
    
    var _settingsBtnTapped = function () {
        var transition = "overlay:up";
        
        app.mobileApp.navigate('views/settings.html', transition);
    };
    
    var _startWorkoutBtnTapped = function () {
        if (startWorkoutViewModel.workoutId === '') {
            return;
        }
        
        app.mobileApp.navigate('views/workoutInProgress.html?uid=' + _workoutUid);
    };

    return {
        init: init,
        show: show
    };
}());