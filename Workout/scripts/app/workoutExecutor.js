var WorkoutExecutor = function (workout, onNext, onPrev, onComplete, onExerciseFirstSideComplete, onUpdateRemainingSeconds) {
    var _onNext,
        _onPrev,
        _onComplete,
        _onExerciseFirstSideComplete,
        _dualExerciseFirstSideComplete,
        _onUpdateRemainingSeconds,
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
        if (_getCurrentExercise().isDualSided) {
            _dualExerciseFirstSideComplete = false;
        }
        
        var secondsRemaining = _getCurrentExercise().seconds;
        
        _countDownTimer = new CountDownTimer(secondsRemaining, _updateRemainingSeconds, _endCurrentExercise);
        _countDownTimer.start();
        
        if (_isPaused) {
            _countDownTimer.pause();
        }
    };
    
    var _updateRemainingSeconds = function (remainingSeconds, totalSeconds) {
        if (totalSeconds / 2 === remainingSeconds + 1) {
            if (_getCurrentExercise().isDualSided && !_dualExerciseFirstSideComplete) {
                _onExerciseFirstSideComplete();
                _dualExerciseFirstSideComplete = true;
                
                return;
            }
        }
        
        _onUpdateRemainingSeconds(remainingSeconds, totalSeconds);
    }

    var _endCurrentExercise = function () {
        if (_currentExerciseNumber < _exercises.length - 1) {
            _currentExerciseNumber++;
            _onNext();
            _beginCurrentExercise();
        }
        else {
            _onComplete();
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
    
    var _init = function (workout, onNext, onPrev, onComplete, onExerciseFirstSideComplete, onUpdateRemainingSeconds) {
        _onNext = onNext;
        _onPrev = onPrev;
        _onComplete = onComplete;
        _onExerciseFirstSideComplete = onExerciseFirstSideComplete;
        _onUpdateRemainingSeconds = onUpdateRemainingSeconds;
        _exercises = workout.exercises;
    }(workout, onNext, onPrev, onComplete, onExerciseFirstSideComplete, onUpdateRemainingSeconds);

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