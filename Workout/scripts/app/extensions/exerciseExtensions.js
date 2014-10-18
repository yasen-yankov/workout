var app = app || {};

app.extensions = app.extensions || {};

app.extensions.exercise = (function () {
    var fetchBase64Image = function (exercise) {
        if (exercise.Image !== null && typeof (exercise.Image) !== 'undefined' && exercise.Image.trim() !== '') {
            var base64Image = app.data.base64Images.dataSource.get(exercise.Image);
            
            if (typeof (base64Image) !== 'undefined') {
                exercise.ImageBase64 = base64Image.Base64String;
            }
        }

        return exercise;
    };

    var fetchBase64ImageThumb = function (exercise) {
        if (exercise.ImageThumb !== null && typeof (exercise.ImageThumb) !== 'undefined' && exercise.ImageThumb.trim() !== '') {
            var base64Image = app.data.base64Images.dataSource.get(exercise.ImageThumb);
            
            if (typeof (base64Image) !== 'undefined') {
                exercise.ImageThumbBase64 = base64Image.Base64String;
            }
        }

        return exercise;
    };

    var fetchAllBase64Images = function (exercise) {
        exercise = fetchBase64Image(exercise);
        exercise = fetchBase64ImageThumb(exercise);

        return exercise;
    };

    var fetchAllBase64ImagesForMultipleItems = function (exercises) {
        for (i = 0; i < exercises.length; i++) {
            exercises[i] = fetchBase64Image(exercises[i]);
            exercises[i] = fetchBase64ImageThumb(exercises[i]);
        }

        return exercises;
    };

    return {
        fetchBase64Image: fetchBase64Image,
        fetchBase64ImageThumb: fetchBase64ImageThumb,
        fetchAllBase64Images: fetchAllBase64Images,
        fetchAllBase64ImagesForMultipleItems: fetchAllBase64ImagesForMultipleItems
    }
}());