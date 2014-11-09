var app = app || {};

app.models = app.models || {};

app.models.selectWorkoutLevel = (function () {
    var _circuits,
        _workoutUid,
        selectWorkoutLevelViewModel = {
        levelsDataSource: [{
                    circuits: 1,
                    name: "One"
                },{
                    circuits: 2,
                    name: "Two"
                },{
                    circuits: 3,
                    name: "Three"
                },{
                    circuits: 4,
                    name: "Four"
                },{
                    circuits: 5,
                    name: "Five"
                },
        ]
    };
    
    var initTouchEvents = function (e) {
        e.view.element.find("#levels-list li a").kendoTouch({
            touchstart: _levelTapped
        });
        
        e.view.element.find(".done-btn-js").kendoTouch({
            touchstart: _doneBtnTapped
        });
    };
    
    show = function (e) {
        if (e.view.params.uid && e.view.params.uid !== "undefined") {
            _workoutUid = e.view.params.uid;
            var workout = app.data.workouts.getByUid(_workoutUid);
            _setLevelTimesInViewModel(workout);
        }
        
        _circuits = 1;
        if (e.view.params.circuits && e.view.params.circuits !== "undefined") {
            _circuits = e.view.params.circuits;
        }
        
        _setSelectedLevelInViewModel(parseInt(_circuits));
        
        kendo.bind(e.view.element, selectWorkoutLevelViewModel, kendo.mobile.ui);
        
        initTouchEvents(e);
    };
    
    var _levelTapped = function (e) {
        $("#levels-list li a").each(function(){
            $(this).removeClass("selected");
        });
        
        $(e.sender.element).addClass("selected");
        
        _circuits = e.sender.element.data("circuits");
    };
    
    var _doneBtnTapped = function () {
        var transition = "slide:right";
        
        app.mobileApp.navigate('views/startWorkout.html?uid=' + _workoutUid + '&circuits=' + _circuits, transition);
    }
    
    var _setSelectedLevelInViewModel = function (circuits) {
        for (i = 0; i < selectWorkoutLevelViewModel.levelsDataSource.length; i++) {
            if (selectWorkoutLevelViewModel.levelsDataSource[i].circuits === circuits) {
                selectWorkoutLevelViewModel.levelsDataSource[i].selected = true;
            }
            else {
                selectWorkoutLevelViewModel.levelsDataSource[i].selected = false;
            }
        }
    }
    
    var _setLevelTimesInViewModel = function (workout) {
        workout = app.extensions.workout.fetchExercises(workout);
        
        var secondsForOneCircuit = 0;
        
        for (var i = 0; i < workout.Exercises.length; i++) {
            secondsForOneCircuit += workout.ExercisesOrder[workout.Exercises[i].Id].seconds;
            
            if (i < workout.Exercises.length - 1) { 
                secondsForOneCircuit += workout.RestInterval;
            }
        }
        
        for (i = 0; i < selectWorkoutLevelViewModel.levelsDataSource.length; i++) {
            var circuits = selectWorkoutLevelViewModel.levelsDataSource[i].circuits;
            var seconds = (circuits * secondsForOneCircuit) + ((circuits - 1) * 30);
            selectWorkoutLevelViewModel.levelsDataSource[i].time = _convertSecondsToText(seconds);
        }
    }
    
    var _convertSecondsToText = function (seconds) {
        var _minutes = Math.floor(seconds / 60);
        var _seconds = seconds - _minutes * 60;
        var _secondsString = _seconds + "";

        if (_secondsString.length < 2) {
            _secondsString = "0" + _secondsString;
        }

        var _text = _minutes + ":" + _secondsString;
            
        return _text;
    }

    return {
        show: show
    };
}());