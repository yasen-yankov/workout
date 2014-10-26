var app = app || {};
app.models = app.models || {};

app.models.settings = (function () {

    var downloadUpdate = function (e) {
        app.updater.checkForUpdate();
    };

    var initContentUpdateButton = function () {
        var btn = $("#content-update"),
            pendingUpdate = app.updater.pendingUpdate,
            iconToHide = pendingUpdate ? "check" : "download",
            text = pendingUpdate ? "Download update" : "Content is up to date",
            disabled = pendingUpdate ? "disabled" : "";
        
        btn.find(".km-" + iconToHide).hide();
        btn.attr("disabled", disabled);
        btn.find(".km-text").html(text);
        
        btn.kendoMobileButton();
    };
    
    var init = function (e) {
        initContentUpdateButton();
    };

    var show = function (e) {
        
    };

    return {
        downloadUpdate: downloadUpdate,
        show: show,
        init: init
    };
}());