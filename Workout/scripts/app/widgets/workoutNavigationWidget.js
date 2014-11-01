(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;

    var WorkoutNavigation = Widget.extend({
        init: function(element, options) {
            var self = this;
            
            Widget.fn.init.call(self, element, options);
            
            self._paused = false;
            
            self._initElements()
            self._initTouchEvents();
        },
                  
        options: {
            name: "WorkoutNavigation",
            onPrevious: function () {},
            onNext: function () {},
            onPause: function () {},
            onResume: function () {},
            resumePauseToggleElement: null,
            showPrevious: true,
            showNext: true
        },
        
        destroy: function() {
            Widget.fn.destroy.call(this);
            kendo.destroy(this.element);
        },
        
        refresh: function() {
            var self = this;
            
            self._paused = false;
            self._setResumeCountdownUI();
        },
        
        setCountdownSeconds: function (seconds) {
            var self = this;
            
            var _text = self._convertSecondsToText(seconds);
            
            self._countdownText.text(_text);
        },
        
        _setResumeCountdownUI: function () {
            var self = this;
            
            self._countdownText.css("opacity", "1");
            self._nextBtn.hide();
            self._prevBtn.hide();
        },
        
        _setPauseCountdownUI: function () {
            var self = this;
            
            self._countdownText.css("opacity", "0.3");
            self._nextBtn.show();
            self._prevBtn.show();
        },
        
        _convertSecondsToText: function (seconds) {
            var _minutes = Math.floor(seconds / 60);
            var _seconds = seconds - _minutes * 60;
            var _secondsString = _seconds + "";

            if (_secondsString.length < 2) {
                _secondsString = "0" + _secondsString;
            }

            var _text = _minutes + ":" + _secondsString;
            
            return _text;
        },
        
        _resumePauseToggleElementTapped: function (e, self) {
            if (e.touch.initialTouch.className.indexOf(self._nextBtnSelectorClass) > -1 ||
                e.touch.initialTouch.parentElement.className.indexOf(self._nextBtnSelectorClass) > -1 || 
                e.touch.initialTouch.className.indexOf(self._prevBtnSelectorClass) > -1 ||
                e.touch.initialTouch.parentElement.className.indexOf(self._prevBtnSelectorClass) > -1) {
                return;
            }
            
            if (self._paused) {
                self._setResumeCountdownUI();
                self.options.onResume();
            }
            else {
                self._setPauseCountdownUI();
                self.options.onPause();
            }
            
            self._paused = !self._paused;
        },
        
        _initElements: function () {
            var self = this;
            
            self.element.addClass("content-stretched content-stretched-position-bottom flex-direction-horizontal u-mb20");
            
            self._prevBtnSelectorClass = "prev-btn-js";
            self._prevBtn = $("<a></a>")
                .addClass(self._prevBtnSelectorClass + ' prev-exercise-btn content--flex');
            
            var _previousContent = $("<span></span>")
                .addClass("km-icon km-prev");
            
            if (self.options.showPrevious) {
                self._prevBtn.append(_previousContent);
            }
            
            self._prevBtn.hide();
            self.element.append(self._prevBtn);
            
            self._countdownText = $("<div></div>")
                .addClass('count-down-text content--flex');
            
            self.element.append(self._countdownText);
            
            self._nextBtnSelectorClass = "next-btn-js";
            self._nextBtn = $("<a></a>")
                .addClass(self._nextBtnSelectorClass + ' next-exercise-btn content--flex');
            
            var _nextContent = $("<span></span>")
                .addClass("km-icon km-next");
            
            if (self.options.showNext) {
                self._nextBtn.append(_nextContent);
            }
            
            self._nextBtn.hide();
            self.element.append(self._nextBtn);
        },
        
        _initTouchEvents: function () {
            var self = this;
            
            if (self.options.resumePauseToggleElement !== null) {
                self.options.resumePauseToggleElement = $(self.options.resumePauseToggleElement);
                
                self.options.resumePauseToggleElement.kendoTouch({
                    touchstart: function (e) {
                        self._resumePauseToggleElementTapped(e, self);
                    }
                });
            }
            
            self._nextBtn.kendoTouch({
                touchstart: self.options.onNext
            });
            
            self._prevBtn.kendoTouch({
                touchstart: self.options.onPrevious
            });
        }
    });
    
    ui.plugin(WorkoutNavigation);
})(window.kendo.jQuery);