var app = app || {};
app.data = app.data || {};

app.data.exercises = (function () {
    var typeName = 'Exercises',
        exercisesDataSource = new kendo.data.DataSource();

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

    document.addEventListener('appInitialized', function () {
        init();
    }, false);

    return exercisesDataSource;
}());