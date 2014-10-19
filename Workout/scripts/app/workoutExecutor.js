var workoutExecutor = function (workout, onNext, setCountDownText) {
    var _onNext,
        _setCountDownText,
        _currentExerciseNumber,
        _exercises,
        _countDownTimeout,
        _paused,
        _countDownSecondsRemaining,
        _countDownOnEnd;

    var _getCurrentExercise = function () {
        return _exercises[_currentExerciseNumber];
    }

    var begin = function () {
        _currentExerciseNumber = 0;

        _beginCurrentExercise();
    };

    var end = function () {
        window.clearTimeout(_countDownTimeout);
    };

    var _beginCurrentExercise = function () {
        var secondsRemaining = _getCurrentExercise().seconds;

        _countDown(secondsRemaining, _endCurrentExercise);
    };

    var _endCurrentExercise = function () {
        if (_currentExerciseNumber < _exercises.length) {
            _currentExerciseNumber++;
            _onNext();
            _beginCurrentExercise();
        }
    };

    var _countDown = function (secondsRemaining, onEnded) {
        _countDownSecondsRemaining = secondsRemaining;
        _countDownOnEnd = onEnded;
        
        var minutes = Math.floor(_countDownSecondsRemaining / 60);
        var seconds = _countDownSecondsRemaining - minutes * 60;
        var secondsString = seconds + "";

        if (secondsString.length < 2) {
            secondsString = "0" + secondsString;
        }

        var text = minutes + ":" + secondsString;

        _setCountDownText(text);

        if (_countDownSecondsRemaining > 0) {
            _countDownSecondsRemaining--;

            _countDownTimeout = window.setTimeout(function () {
                _countDown(_countDownSecondsRemaining, _countDownOnEnd);
            }, 1000);
        }
        else {
            _countDownOnEnd();
        }
    };
    
    var pause = function () {
        _paused = true;
        window.clearTimeout(_countDownTimeout);
    };
    
    var resume = function () {
        _paused = false;
        _countDown(_countDownSecondsRemaining + 1, _countDownOnEnd);
    };
    
    var isPaused = function () {
        return _paused;
    };
    
    var _init = function (workout, onNext, setCountDownText) {
        _onNext = onNext;
        _setCountDownText = setCountDownText;
        _exercises = workout.exercises;
    }(workout, onNext, setCountDownText);

    return {
        begin: begin,
        end: end,
        pause: pause,
        resume: resume,
        isPaused: isPaused,
        //next: next,
        //prev: prev
    }
};