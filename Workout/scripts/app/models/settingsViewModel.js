var app = app || {};
app.models = app.models || {};

app.models.settings = (function () {
    var settingsViewModel = {
        downloadUpdate: function (e) {
            app.updater.checkForUpdate();
        }
    }
    
    return settingsViewModel;
}());