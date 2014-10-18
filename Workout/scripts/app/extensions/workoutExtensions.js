var app = app || {};

app.extensions = app.extensions || {};

app.extensions.workout = (function () {
    var sortExercisesByOrder = function (workout) {
        var exercisesOrdered = workout.Exercises.slice();

        exercisesOrdered.sort(function (a, b) {
            return workout.ExercisesOrder[a.Id].ordinal - workout.ExercisesOrder[b.Id].ordinal;
        });

        workout.Exercises.length = 0;

        for (i = 0; i < exercisesOrdered.length; i++) {
            workout.Exercises.push(exercisesOrdered[i]);
        }

        return workout;
    };
    
    var fetchExercises = function (workout) {
        if (workout.Exercises === null) {
            workout.Exercises = [];
        }

        if (workout.Exercises.length > 0 && typeof (workout.Exercises[0]) !== 'object') {
            workout.Exercises = app.data.exercises.getByIds(workout.Exercises);
        }
        
        return workout;
    };
    
    var addRestsBetweenExercises = function(workout) {
        var exercises = [];
        
        for (var i = 0; i < workout.Exercises.length; i++) {
            exercises.push(workout.Exercises[i]);
            
            if (i !== workout.Exercises.length - 1) {
                var rest = {
                    isRest: true,
                    nextExerciseImageThumbBase64: workout.Exercises[i + 1].ImageThumbBase64,
                    nextExerciseName: workout.Exercises[i + 1].Name,
                    seconds: workout.RestInterval
                };
                
                exercises.push(rest);
            }
        }
        
        workout.Exercises = exercises;
        
        return workout;
    };

    return {
        sortExercisesByOrder: sortExercisesByOrder,
        fetchExercises: fetchExercises,
        addRestsBetweenExercises: addRestsBetweenExercises
    }
}());