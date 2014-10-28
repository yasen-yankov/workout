var CountDownTimer = function (seconds, setRemainingSeconds, onEnded) {
    var _countDownTimeout,
        _paused,
        _setRemainingSeconds,
        _countDownSecondsRemaining,
        _countDownOnEnd;
    
    var _countDown = function () {
        _setRemainingSeconds(_countDownSecondsRemaining);
        
        if (_paused) {
            return;
        }

        if (_countDownSecondsRemaining > 0) {
            _countDownSecondsRemaining--;

            _countDownTimeout = window.setTimeout(function () {
                _countDown();
            }, 1000);
        }
        else {
            _countDownOnEnd();
        }
    };
    
    var start = function () {
        _countDown();
    };
    
    var pause = function () {
        _paused = true;
        window.clearTimeout(_countDownTimeout);
        _countDownSecondsRemaining++;
    };
    
    var resume = function () {
        _paused = false;
        _countDown();
    };
    
    var isPaused = function () {
        return _paused;
    };
    
    var dispose = function () {
        window.clearTimeout(_countDownTimeout);
    };
    
    var _init = function (seconds, setRemainingSeconds, onEnded) {
        _countDownSecondsRemaining = seconds;
        _setRemainingSeconds = setRemainingSeconds;
        _countDownOnEnd = onEnded;
    }(seconds, setRemainingSeconds, onEnded);
    
    return {
        start: start,
        pause: pause,
        resume: resume,
        isPaused: isPaused,
        dispose: dispose
    }
};