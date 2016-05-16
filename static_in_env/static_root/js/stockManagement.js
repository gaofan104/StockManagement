'use strict';

var app = angular.module('myModule', ['datatables', 'datatables.bootstrap']);

app.controller('boostrapCtrl', function($scope, DTOptionsBuilder){
    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();
});
//.controller('angularTableCtrl', angularTableCtrl);
//
//function angularTableCtrl() {
//
//}