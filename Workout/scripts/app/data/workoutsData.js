var app = app || {};
app.data = app.data || {};

app.data.workouts = (function () {
    var typeName = 'Workouts',
        workoutsDataSource = new kendo.data.DataSource();

    var init = function () {
        if (localStorage.getItem(typeName) != null) {
            var data = JSON.parse(localStorage.getItem(typeName));
            workoutsDataSource.data(data);
        } else {
            var exercisesExp = {
                "Exercises": true
            };

            app.everlive.data(typeName).expand(exercisesExp).get()
                .then(function (data) {
                    localStorage.setItem(typeName, JSON.stringify(data.result));
                    workoutsDataSource.data(data.result);
                });
        }
    };

    document.addEventListener('appInitialized', function () {
        init();
    }, false);

    return workoutsDataSource;
}());