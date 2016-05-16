// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

stockManagement.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item) {


  $scope.item = item;
  $scope.selected = {
    item: $scope.item
  };


  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

stockManagement.controller('OrderFormCtrl', function($scope, $http){
    $scope.submit = function(){
        var in_data = { item : $scope.item};
        $http.post('/static/stockManagement/angular/directive-html/buy-form-modal.html', in_data)
            .success(function(out_data) {
                console.log("successfully posted");
        });
    }
});