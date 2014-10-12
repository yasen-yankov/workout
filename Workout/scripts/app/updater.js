var app = app || {};

app.updater = (function () {
    var typeName = "Updates",
        lastUpdateItemKey = "lastUpdateItemKey",
        lastUpdateItem = JSON.parse(localStorage.getItem(lastUpdateItemKey)) || { Version: 0 },
        modalUpdateView = $("#modalview-update"),
        appInitializedEvent = new CustomEvent("appInitialized"),
        contentUpdateEvent = new CustomEvent("contentUpdate", {
            "detail": {
                "lastUpdateItem": {},
                "updateItem": {}
            }
        });

    var checkForUpdate = function () {
        var query = new Everlive.Query();
        query.where().gt('Version', parseFloat(lastUpdateItem.Version)).done().orderDesc('Version');

        app.everlive.data(typeName).get(query)
            .then(function (data) {
                if (data.count > 0) {
                    var updateItem = data.result[0];
                    updateItem.Version = updateItem.Version.toFixed(1);

                    askUserToUpdate(updateItem);
                } else {
                    document.dispatchEvent(appInitializedEvent);
                }
            });
    }

    var askUserToUpdateViewModel = {
        download: function (e) {
            update(e.data.updateItem);
            $("#modalview-update").kendoMobileModalView("close");
        },
        cancel: function (e) {
            document.dispatchEvent(appInitializedEvent);
            $("#modalview-update").kendoMobileModalView("close");
        }
    }

    var askUserToUpdate = function (updateItem) {
        var updateModelView = $("#modalview-update");

        askUserToUpdateViewModel.lastUpdateItem = lastUpdateItem;
        askUserToUpdateViewModel.updateItem = updateItem;
        kendo.bind(updateModelView, askUserToUpdateViewModel, kendo.mobile.ui);
        updateModelView.kendoMobileModalView("open");
    }

    var update = function (updateItem) {
        localStorage.clear();
        
        contentUpdateEvent.detail.lastUpdateItem = lastUpdateItem;
        contentUpdateEvent.detail.updateItem = updateItem;
        document.dispatchEvent(contentUpdateEvent);

        localStorage.setItem(lastUpdateItemKey, JSON.stringify(updateItem));

        document.dispatchEvent(appInitializedEvent);
    }

    checkForUpdate();
    
    return {
        checkForUpdate: checkForUpdate
    };
}());