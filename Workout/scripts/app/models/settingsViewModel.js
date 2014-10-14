var app = app || {};
app.models = app.models || {};

app.models.settings = (function () {

    var downloadUpdate = function (e) {
        app.updater.checkForUpdate();
    };

    var showContentUpdateButton = function () {
        var contentUpdateButton = $("#content-update"),
            iconName = app.updater.pendingUpdate ? "download" : "check",
            text = app.updater.pendingUpdate ? "Download update" : "Version is up to date",
            disabled = app.updater.pendingUpdate ? true : false;
        
        contentUpdateButton.attr("data-icon", iconName);
        contentUpdateButton.attr("disabled", disabled);
        contentUpdateButton.html(text);
        
        contentUpdateButton.kendoMobileButton();
    };

    var show = function (e) {
        showContentUpdateButton();
    }

    return {
        downloadUpdate: downloadUpdate,
        show: show
    };
}());