angular.module('todo.controllers', ['todo.services'])

.controller('todoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate,$filter,$ionicPopup,$ionicPlatform,$cordovaLocalNotification) {

$scope.hasPermission = function () {
                $cordovaLocalNotification.hasPermission(function (granted) {
                   alert("hasPermission");
                    alert(granted ? "Yes" : "No");
                });
            };
 $scope.registerPermission = function () {
                $cordovaLocalNotification.registerPermission(function (granted) {
                  alert("registerpremission");
                  alert(granted);
                    alert(granted ? "Yes" : "No");
                });
            };

$scope.addNotify = function(task) {
        alert(task.Title);
        $scope.hasPermission();
        $scope.registerPermission();
        var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);
        alert(alarmTime);
        $cordovaLocalNotification.add({
            id: 1234,
            date: alarmTime,
            every : "second",
            message: task.Title,
            title: task.Title,
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });
    };
    $scope.callback = function () {
      alert("callback");
                $cordovaLocalNotification.getIds(function (ids) {
                    alert('IDs: ' + ids.join(' ,'));
                });
            };
    
     $scope.cancelNotification = function () {
    $cordovaLocalNotification.cancel('123456').then(function () {
      alert('callback for cancellation background notification');
    });
  };

  $scope.cancelAllNotification = function () {
    $cordovaLocalNotification.cancelAll().then(function () {
      alert('callback for canceling all background notifications');
    });
  };
    
    
 
   $scope.addNotify1 = function() {
        var alarmTime = new Date();
         alert("alarmTime");
        $scope.hasPermission();
        $scope.registerPermission();
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);
        alert(alarmTime);
        $cordovaLocalNotification.add({
            id: 123456,
            date: alarmTime,
            every : "second",
            message: "Test message",
            title: "Test Title",
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });
    };
    
    // A confirm dialog
    $scope.showConfirm = function(onYes, onNo) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Task',
      template: 'Are you sure you want to delete this task?'
    });
    confirmPopup.then(function(res) {
      if(res) {
  
        onYes();
      } else {
  
        if (onNo)
          onNo();
      }
    });
    };

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });
  
  // Edit and load the Modal
  $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
    $scope.editTaskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title,
      datetime:task.datetime
    });
    alert(task.Title);
    $scope.addNotify(task);
    
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
    
  };
  
  
  $scope.newTask = function() {
    $scope.task ={tile : "",datetime : new Date()};
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
  
  // delete selected task
  $scope.deleteTask = function(i, task) {
    if (!$scope.activeProject || !task ) {
      return;
    }
    console.log("start deleting");
    $scope.showConfirm(function() {
      console.log("confirmed to delete task "+i);
      $scope.activeProject.tasks.splice(i,1);
      Projects.save($scope.projects);
    });
  }
  
  // Open our new task modal
  $scope.editTask = function(task, i) {
    $scope.task = {title: task.title, datetime: task.datetime};
    $scope.taskIndex = i;
    $scope.editTaskModal.show();
  };
  
  $scope.closeEditTask = function() {
    $scope.editTaskModal.hide();
  };
  
  // Called when the form is submitted
  $scope.updateTask = function(i, task) {
    if (!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks[i] = task;
    $scope.editTaskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.cleanUp = function() {
    $scope.task = undefined;
window.localStorage['lastActiveProject'] = 0;
window.localStorage['projects'] =undefined;
  };
  
  $scope.$watch('task.datetime', function(unformattedDate){
   // alert(unformattedDate);
   if(unformattedDate)
      $scope.task.formattedBirthDate = $filter('date')(unformattedDate, 'dd/MM/yyyy HH:mm');
    
  });
  
  $scope.openDatePicker = function() {
    $scope.tmp = {};
    
    if (typeof $scope.task == "undefined") {
    // Works
    $scope.task = {title:"title" };
    $scope.task.datetime = new Date();
    alert(this.task.title);
    }
    
   $scope.tmp.newDate = $scope.task.datetime;
    
    var birthDatePopup = $ionicPopup.show({
     template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
     title: "Start date",
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           $scope.task.datetime = $scope.tmp.newDate;
         }
       }
     ]
    });
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});
