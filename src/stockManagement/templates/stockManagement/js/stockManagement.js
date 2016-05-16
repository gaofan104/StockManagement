var stockManagement = angular.module('stockManagement', ['ngRoute', 'ngAnimate', 'ui.bootstrap',
'angularUtils.directives.dirPagination', 'djng.forms', 'datatables', 'datatables.bootstrap', 'datatables.tabletools',
'datatables.colvis', 'angularMoment', 'ngResource', 'ngFileUpload', 'ui.checkbox']);

stockManagement.run(function($rootScope){
//    $rootScope.hello = {};
    $rootScope.user = {};
});

stockManagement.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/stockManagement/html/home.html',
        controller: 'homeCtrl'
      })
      .when('/orderList', {
        templateUrl: '/static/stockManagement/angular/templates/orderList.html',
        controller: 'OrderListCtrl'
      })
      .when('/stats', {
        templateUrl: '/static/stockManagement/html/stats.html',
        controller: ''
      })
      .when('/buy_form', {
        templateUrl: '/static/stockManagement/angular/templates/buy-form-modal.html',
        controller: 'ModalInstanceCtrl'
      })
      .when('/snacks', {
        templateUrl: '/static/stockManagement/angular/templates/buy-form-modal.html',
        controller: ''
      })
        .when('/demo', {
        templateUrl: '/static/stockManagement/angular/templates/fileUploadDemo.html',
        controller: 'FileUploadDemoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);

//stockManagement.config(['$httpProvider', function($httpProvider) {
//    $httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';
//}]);
//
//stockManagement.config(function($httpProvider) {
//    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
//    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
//});
//stockManagement.config(['$httpProvider', function ($httpProvider) {
//        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//}]);
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
    $scope.myInterval = 2000;
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
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/stockManagement/order_form/' + item.id,
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            item: function() {
              return item;
            },
            order: function(){
              return null;
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

stockManagement.factory('OrderList', ['$resource', function($resource) {
    return $resource('/stockManagement/orders', null,
    {
        'update':{ method:'PUT'}
    });
}]);

stockManagement.factory('UserList', ['$resource', function($resource) {
    return $resource('/stockManagement/users', null,
    {
        'update':{ method:'PUT'}
    });
}]);

stockManagement.config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});