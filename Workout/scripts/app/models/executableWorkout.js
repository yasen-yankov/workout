var ExecutableWorkout = function (workout) {
    var _exercises,
        _initialNumberOfExercises;
    
    var _getExecutableExercises = function (exercises, exercisesSettings) {
        var _executableExercises = [];
        
        for (var i = 0; i < exercises.length; i++) {
            var _executableExercise = {
                name: exercises[i].Name,
                imageThumbBase64: exercises[i].ImageThumbBase64,
                imageBase64: exercises[i].ImageBase64,
                seconds: exercisesSettings[exercises[i].Id].seconds,
                isRest : false
            };
            
            _executableExercises.push(_executableExercise);
        }
        
        return _executableExercises;
    }
    
    var _addRestsBetweenExercises = function (exercises, restInterval) {
        var _exercises = [];

        for (var i = 0; i < exercises.length; i++) {
            _exercises.push(exercises[i]);

            if (i !== exercises.length - 1) {
                var rest = {
                    isRest: true,
                    nextExerciseImageThumbBase64: exercises[i + 1].imageThumbBase64,
                    nextExerciseName: exercises[i + 1].name,
                    seconds: restInterval
                };
                
                _exercises.push(rest);
            }
        }
        
        exercises = _exercises;

        return exercises;
    };
    
    var _init = function (workout) {
        _exercises = _getExecutableExercises(workout.Exercises, workout.ExercisesOrder);
        _initialNumberOfExercises = _exercises.length;
        _exercises = _addRestsBetweenExercises(_exercises, workout.RestInterval);
    }(workout);
    
    return {
        exercises: _exercises,
        initialNumberOfExercises: _initialNumberOfExercises
    }
};