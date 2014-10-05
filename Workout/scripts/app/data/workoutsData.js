var app = app || {};
app.data = app.data || {};

app.data.workouts = (function () {
    
    var typeName = 'Workouts';

    var exercisesExp = {
        "Exercises": true
    };

    var workoutsDataSource = new kendo.data.DataSource({
        type: 'everlive',
        transport: {
            typeName: typeName,
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-Everlive-Expand', JSON.stringify(exercisesExp))
                }
            }
        },
    });

    return workoutsDataSource;

}());