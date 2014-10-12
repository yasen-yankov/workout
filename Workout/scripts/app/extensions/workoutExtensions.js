var app = app || {};
app.extensions = app.extensions || {};

app.extensions.workout = (function () {
    return {
        sortExercisesByOrder: function(workout) {
            var exercisesOrdered = workout.Exercises.slice();
            
            exercisesOrdered.sort(function (a, b) {
                return workout.ExercisesOrder[a.Id].ordinal - workout.ExercisesOrder[b.Id].ordinal;
            });
            
            workout.Exercises.length = 0;
            
            for(i = 0; i < exercisesOrdered.length; i++) {
                workout.Exercises.push(exercisesOrdered[i]);
            }
            
            return workout;
        }
    }
}());