var app = app || {};
app.models = app.models || {};

app.models.startWorkout = (function () {
    var _workoutUid,
        _circuits;
    
    var startWorkoutViewModel = {
        workoutId: '',
        workoutName: '',
        circuits: 1
    }
    
    init = function (e) {
        _initTouchEvents(e);
    };
    
    var show = function (e) {
        _circuits = 1;
        if (e.view.params.circuits && e.view.params.circuits !== "undefined") {
            _circuits = e.view.params.circuits;
        }
        
        if (!_workoutUid) {
            if (e.view.params.uid && e.view.params.uid !== "undefined") {
                _workoutUid = e.view.params.uid;
            }
        }
        
        if (_workoutUid) {
            var workout = app.data.workouts.getByUid(_workoutUid);
            
            startWorkoutViewModel.workoutId = workout.Id;
            startWorkoutViewModel.workoutName = workout.Name;
        }

        startWorkoutViewModel.circuits = _circuits;
        
        kendo.bind(e.view.element, startWorkoutViewModel, kendo.mobile.ui);
    };
    
    var _initTouchEvents = function (e) {
        e.view.element.find(".settings-btn-js").kendoTouch({
            touchstart: _settingsBtnTapped
        });
        
        e.view.element.find(".start-workout-btn-js").kendoTouch({
            touchstart: _startWorkoutBtnTapped
        });
        
        e.view.element.find("#selectNumberOfCircuits").kendoTouch({
            touchstart: _selectNumberOfCircuitsTapped
        });
    };
    
    var _selectNumberOfCircuitsTapped = function () {
        var transition = "slide:left";
        
        app.mobileApp.navigate('views/selectWorkoutLevel.html?uid=' + _workoutUid + '&circuits=' + _circuits, transition);
    };
    
    var _settingsBtnTapped = function () {
        var transition = "overlay:up";
        
        app.mobileApp.navigate('views/settings.html', transition);
    };
    
    var _startWorkoutBtnTapped = function () {
        if (startWorkoutViewModel.workoutId === '') {
            return;
        }
        
        app.mobileApp.navigate('views/workoutInProgress.html?uid=' + _workoutUid + '&circuits=' + _circuits);
    };

    return {
        init: init,
        show: show
    };
}());