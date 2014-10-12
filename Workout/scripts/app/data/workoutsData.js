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

    var update = function (lastUpdateItem, updateItem) {
        var query = new Everlive.Query();

        if (typeof (lastUpdateItem.ToDate) != 'undefined') {
            query.where().gt('ModifiedAt', lastUpdateItem.ToDate)
        }

        query.where().lt('ModifiedAt', updateItem.ToDate).done();

        app.everlive.data(typeName).get(query)
            .then(function (data) {
            });
    };

    document.addEventListener('appInitialized', function () {
        init();
    }, false);

    document.addEventListener('contentUpdate', function (e) {
        update(e.detail.lastUpdateItem, e.detail.updateItem);
    }, false);

    return workoutsDataSource;
}());