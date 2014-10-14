var app = app || {};
app.data = app.data || {};

app.data.exercises = (function () {
    var typeName = 'Exercises',
        exercisesDataSource = new kendo.data.DataSource({
            schema: {
                model: {
                    id: "Id"
                }
            }
        });

    var init = function () {
        if (localStorage.getItem(typeName) != null) {
            var data = JSON.parse(localStorage.getItem(typeName));
            exercisesDataSource.data(data);
        } else {
            app.everlive.data(typeName).get()
                .then(function (data) {
                    localStorage.setItem(typeName, JSON.stringify(data.result));
                    exercisesDataSource.data(data.result);
                });
        }
    }

    var getByIds = function (ids) {
        var exercises = [];

        for (i = 0; i < ids.length; i++) {
            var exercise = exercisesDataSource.get(ids[i]);
            exercises.push(exercise);
        }

        return exercises;
    };

    document.addEventListener('appInitialized', function () {
        init();
    }, false);

    return {
        dataSource: exercisesDataSource,
        getByIds: getByIds
    };
}());