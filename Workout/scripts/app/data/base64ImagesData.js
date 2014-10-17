var app = app || {};
app.data = app.data || {};

app.data.base64Images = (function () {
    var typeName = 'Base64Images',
        base64ImagesDataSource = new kendo.data.DataSource({
            schema: {
                model: {
                    id: "Id"
                }
            }
        });

    var init = function () {
        if (localStorage.getItem(typeName) != null) {
            var data = JSON.parse(localStorage.getItem(typeName));
            base64ImagesDataSource.data(data);
        } else {
            app.everlive.data(typeName).get()
                .then(function (data) {
                    localStorage.setItem(typeName, JSON.stringify(data.result));
                    base64ImagesDataSource.data(data.result);
                });
        }
    }

    document.addEventListener('appInitialized', function () {
        init();
    }, false);

    return {
        dataSource: base64ImagesDataSource
    };
}());