var app = app || {};

app.models = app.models || {};

app.models.selectWorkoutLevel = (function () {
    var selectWorkoutLevelViewModel = {
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

    init = function (e) {
        initTouchEvents(e);
    };
    
    var initTouchEvents = function (e) {
        e.view.element.find("#levels-list li a").kendoTouch({
            tap: levelTapped
        });
    };
    
    show = function (e) {
        var workoutUid = e.view.params.uid;
        var workout = app.data.workouts.getByUid(workoutUid);
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
        
        kendo.bind(e.view.element, selectWorkoutLevelViewModel, kendo.mobile.ui);
    };
    
    var levelTapped = function (e) {
    };
    
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
        init: init,
        show: show
    };
}());