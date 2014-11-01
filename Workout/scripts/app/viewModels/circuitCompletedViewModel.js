var app = app || {};
app.models = app.models || {};

app.models.circuitCompleted = (function () {
    var _workoutUid,
        _circuits,
        _countDownTimer;
    
    init = function (e) {
        var _workoutNavigationElement = e.view.element.find("#workoutNavigation");
        _workoutNavigationElement.kendoWorkoutNavigation({
            onNext: _startNextCircuit,
            showPrevious: false,
            resumePauseToggleElement: $("#circuitCompletedWrapper"),
            onResume: _resume,
            onPause: _pause
        });
        
        _workoutNavigation = _workoutNavigationElement.getKendoWorkoutNavigation();
        
        _initTouchEvents(e);
    };
    
    show = function (e) {
        _workoutUid = e.view.params.uid;
        _circuits = e.view.params.circuits;
        
        _setRemainingCircuitsText();
        
        _countDownTimer = new CountDownTimer(30, _updateRemainingSeconds, _startNextCircuit);
        _countDownTimer.start();
    };
    
    var _initTouchEvents = function () {
        $("#circuitCompleted #endWorkoutBtn").kendoTouch({
            tap: _endWorkout
        });
    };
    
    var _setRemainingCircuitsText = function () {
        var remainingCircuits = $("#circuitCompleted .remaining-circuits-js");
        
        if (_circuits === "1") {
            remainingCircuits.text("Only one more to go.");
        }
        else {
            remainingCircuits.text(_circuits + " more to go.");
        }
    };
    
    var _endWorkout = function () {
        var transition = "slide:right";

        if (app.devicePlatform === mobilePlatforms.android) {
            transition = "none";
        }
        
        app.mobileApp.navigate('views/startWorkout.html', transition);
    };
    
    var _startNextCircuit = function () {
        app.mobileApp.navigate('views/workoutInProgress.html?uid=' + _workoutUid + '&circuits=' + _circuits + '&skipInitialCountdown=true');
    };
    
    var _updateRemainingSeconds = function (remainingSeconds, totalSeconds) {
        _workoutNavigation.setCountdownSeconds(remainingSeconds, totalSeconds);
    };
    
    var _resume = function () {
        _countDownTimer.resume();
    };
    
    var _pause = function () {
        _countDownTimer.pause();
    };

    return {
        init: init,
        show: show
    };
}());