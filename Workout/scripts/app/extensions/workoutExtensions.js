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

    return {
        sortExercisesByOrder: sortExercisesByOrder,
        fetchExercises: fetchExercises
    }
}());