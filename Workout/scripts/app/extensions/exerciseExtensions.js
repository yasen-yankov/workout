var app = app || {};
app.extensions = app.extensions || {};

app.extensions.exercise = (function () {
    var defaultExerciseSVGImage = '';

    return {
        setDefaultSVGImage: function (exercise) {
            if (exercise.SVGImage == null || typeof (exercise.SVGImage) === 'undefined' || exercise.SVGImage.trim() == '') {
                exercise.SVGImage = defaultExerciseSVGImage;
            }

            return exercise;
        },
        setDefaultSVGImages: function (exercises) {
            for (i = 0; i < exercises.length; i++) {
                exercises[i] = this.setDefaultSVGImage(exercises[i]);
            }

            return exercises;
        }
    }
}());