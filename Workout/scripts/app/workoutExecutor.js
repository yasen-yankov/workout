var workoutExecutor = function () {
    var _workout,
        _onPrev,
        _onNext,
        _setCountDownText,
        _currentExerciseNumber,
        _exercises,
        _countDownTimeout,
        _paused,
        _pausedCountDownSecondsRemaining,
        _pausedCountDownOnEnd;

    var initialize = function (workout, onPrev, onNext, setCountDownText) {
        _workout = workout;
        _onPrev = onPrev;
        _onNext = onNext;
        _setCountDownText = setCountDownText;
        _exercises = getExercises(_workout);
    }

    var getCurrentExercise = function () {
        return _exercises[_currentExerciseNumber];
    }

    var getExercises = function (workout) {
        var exercises = [];

        for (i = 0; i < workout.Exercises.length; i++) {
            var exercise = {};
            
            if (!workout.Exercises[i].isRest) {
                exerciseId = workout.Exercises[i].Id;

                exercise.seconds = workout.ExercisesOrder[exerciseId].seconds;
            }
            else {
                exercise = workout.Exercises[i];
            }
            
            exercises.push(exercise);
        }

        return exercises;
    };

    var begin = function () {
        _currentExerciseNumber = 0;

        beginCurrentExercise();
    };

    var end = function () {
        window.clearTimeout(_countDownTimeout);
    };

    var beginCurrentExercise = function () {
        var secondsRemaining = getCurrentExercise().seconds;

        countDown(secondsRemaining, endCurrentExercise);
    };

    var endCurrentExercise = function () {
        if (_currentExerciseNumber < _exercises.length) {
            _currentExerciseNumber++;
            _onNext();
            beginCurrentExercise();
        }
    };

    var countDown = function (secondsRemaining, onEnded) {
        var minutes = Math.floor(secondsRemaining / 60);
        var seconds = secondsRemaining - minutes * 60;
        var secondsString = seconds + "";

        if (secondsString.length < 2) {
            secondsString = "0" + secondsString;
        }
        
        if (_paused) {
            window.clearTimeout(_countDownTimeout);
            _pausedCountDownSecondsRemaining = secondsRemaining;
            _pausedCountDownOnEnd = onEnded;
            
            return;
        }

        var text = minutes + ":" + secondsString;

        _setCountDownText(text);

        if (secondsRemaining > 0) {
            secondsRemaining--;

            _countDownTimeout = window.setTimeout(function () {
                countDown(secondsRemaining, onEnded);
            }, 1000);
        }
        else {
            onEnded();
        }
    };
    
    var pause = function () {
        _paused = true;
    };
    
    var resume = function () {
        _paused = false;
        countDown(_pausedCountDownSecondsRemaining + 1, _pausedCountDownOnEnd);
        _pausedCountDownSecondsRemaining = null;
        _pausedCountDownOnEnd = null;
    };
    
    var isPaused = function () {
        return _paused;
    };

    return {
        initialize: initialize,
        begin: begin,
        end: end,
        pause: pause,
        resume: resume,
        isPaused: isPaused,
        //next: next,
        //prev: prev
    }
};