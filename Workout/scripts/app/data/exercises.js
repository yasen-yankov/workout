var app = app || {};
app.data = app.data || {};

app.data.exercises = (function () {
    var exerciseModel = {
        id: 'Id',
        fields: {
            name: {
                field: 'Name',
                defaultValue: ''
            },
            createdAt: {
                field: 'CreatedAt',
                defaultValue: new Date()
            }
        }
    };

    var exercisesDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: exerciseModel
        },
        transport: {
            typeName: 'Exercises'
        },
    });

    return exercisesDataSource;
}());