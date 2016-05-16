var stockManagement = angular.module('stockManagement', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

stockManagement.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/stockManagement/html/home.html',
        controller: 'homeCtrl'
      })
      .when('/stats', {
        templateUrl: '/static/stockManagement/html/stats.html',
        controller: ''
      })
      .when('/snacks', {
        template: '<div> hello </div>',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);

stockManagement.controller('homeCtrl', ['$scope','$http', '$uibModal', '$log', function($scope, $http, $uibModal, $log) {
    $http.get('/stockManagement/api/items').then(function(response){
        $scope.items = response.data;
        angular.forEach($scope.items, function(item) {
            if( item.image.indexOf('null') < 0 ) $scope.addSlide(item.image, item.name);;
        });

    });

    // sliding image related
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.pageChangeHandler = function(num) {
      console.log('meals page changed to ' + num);
    };
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];

    $scope.addSlide = function(path, name) {
        var newWidth = 600 + slides.length + 1;
        slides.push({

          image: path,
          text: name,
        });
    };

    // modal related
    $scope.animationsEnabled = true;

    $scope.open = function (item) {
        console.log(item);
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/static/stockManagement/angular/directive-html/buy-form-modal.html',
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            item: function() {
              return item;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
    };
}]);

