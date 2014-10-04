var app = app || {};
app.data = app.data || {};

app.data.workouts = (function () {
    var workoutModel = {
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

    var workoutsDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: workoutModel
        },
        transport: {
            typeName: 'Workouts'
        },
    });

    return workoutsDataSource;
}());