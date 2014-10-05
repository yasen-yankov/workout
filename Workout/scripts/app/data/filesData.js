var app = app || {};
app.data = app.data || {};

app.data.files = (function () {

    var emptyGuid = '00000000-0000-0000-0000-000000000000';
    
    return {
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return app.everlive.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        }
    };
}());