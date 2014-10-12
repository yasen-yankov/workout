var app = app || {};

app.updater = (function () {
    var typeName = "Updates",
        lastUpdateVersionKey = "lastUpdateVersionKey",
        lastUpdateVersion = localStorage.getItem(lastUpdateVersionKey) || 0;
    
    lastUpdateVersion = parseInt(lastUpdateVersion);
    
    var appInitializedEvent = new CustomEvent(
        "appInitialized", {
            detail: {
                message: "App Initialized",
                time: new Date(),
            },
            bubbles: true,
            cancelable: true
        }
    );

    var checkForUpdate = function () {
        var query = new Everlive.Query();
        query.where().gt('Version', lastUpdateVersion).done().orderDesc('Version');

        app.everlive.data(typeName).get(query)
            .then(function (data) {
                if (data.count > 0) {
                    var updateItem = data.result[0];
                    update(updateItem);
                } else {
                    document.dispatchEvent(appInitializedEvent);
                }
            });
    }

    var update = function (updateItem) {
        localStorage.clear();
        localStorage.setItem(lastUpdateVersionKey, updateItem.Version);
        
        document.dispatchEvent(appInitializedEvent);
    }

    checkForUpdate();
}());