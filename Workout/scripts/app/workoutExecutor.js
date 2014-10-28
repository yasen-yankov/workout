var WorkoutExecutor = function (workout, onNext, onPrev, onCompleted, updateRemainingSeconds) {
    var _onNext,
        _onPrev,
        _onCompleted,
        _updateRemainingSeconds,
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
    
    var _init = function (workout, onNext, onPrev, onCompleted, updateRemainingSeconds) {
        _onNext = onNext;
        _onPrev = onPrev;
        _onCompleted = onCompleted;
        _updateRemainingSeconds = updateRemainingSeconds;
        _exercises = workout.exercises;
    }(workout, onNext, onPrev, onCompleted, updateRemainingSeconds);

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