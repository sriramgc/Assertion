angular.module('notify', ['ionic'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
 .factory('Notification', ['$q', function($q) {

  return {
    hasPermission: function(options) {
      var q = $q.defer();

        cordova.plugins.notification.local.hasPermission(function (granted) {
                    showToast(granted ? 'Yes' : 'No');
                     });
    }
  }
}])

