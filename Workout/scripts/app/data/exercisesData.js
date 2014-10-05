var app = app || {};
app.data = app.data || {};

app.data.exercises = (function () {

    var exercisesDataSource = new kendo.data.DataSource({
        type: 'everlive',
        transport: {
            typeName: 'Exercises'
        },
    });

    return exercisesDataSource;
}());