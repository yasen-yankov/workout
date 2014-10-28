var WorkoutExecutor = function (workout, onNext, onPrev, onCompleted, setCountDownText) {
    var _onNext,
        _onPrev,
        _onCompleted,
        _setCountDownText,
        _currentExerciseNumber,
        _exercises,
        _countDownTimer,
        _isPaused;

    var _getCurrentExercise = function () {
        return _exercises[_currentExerciseNumber];
    }

    var begin = function () {
        _currentExerciseNumber = 0;

        _beginCurrentExercise();
    };

    var end = function () {
        _countDownTimer.dispose();
    };

    var _beginCurrentExercise = function () {
        var secondsRemaining = _getCurrentExercise().seconds;
        
        _countDownTimer = new CountDownTimer(secondsRemaining, _updateRemainingSeconds, _endCurrentExercise);
        _countDownTimer.start();
        
        if (_isPaused) {
            _countDownTimer.pause();
        }
    };
    
    var _updateRemainingSeconds = function (remainingSeconds) {
        var minutes = Math.floor(remainingSeconds / 60);
        var seconds = remainingSeconds - minutes * 60;
        var secondsString = seconds + "";

        if (secondsString.length < 2) {
            secondsString = "0" + secondsString;
        }

        var text = minutes + ":" + secondsString;

        _setCountDownText(text);
    }

    var _endCurrentExercise = function () {
        if (_currentExerciseNumber < _exercises.length - 1) {
            _currentExerciseNumber++;
            _onNext();
            _beginCurrentExercise();
        }
        else {
            _onCompleted();
        }
    };
    
    var pause = function () {
        _isPaused = true;
        _countDownTimer.pause();
    };
    
    var resume = function () {
        _isPaused = false;
        _countDownTimer.resume();
    };
    
    var isPaused = function () {
        return _isPaused;
    };
    
    var next = function () {
        _countDownTimer.dispose();
        _endCurrentExercise();
    };
    
    var prev = function () {
        if (_currentExerciseNumber === 0) {
            return;
        }
        
        _countDownTimer.dispose();
        _currentExerciseNumber--;
        _onPrev();
        _beginCurrentExercise();
    };
    
    var _init = function (workout, onNext, onPrev, onCompleted, setCountDownText) {
        _onNext = onNext;
        _onPrev = onPrev;
        _onCompleted = onCompleted;
        _setCountDownText = setCountDownText;
        _exercises = workout.exercises;
    }(workout, onNext, onPrev, onCompleted, setCountDownText);

    return {
        begin: begin,
        end: end,
        pause: pause,
        resume: resume,
        isPaused: isPaused,
        next: next,
        prev: prev
    }
};