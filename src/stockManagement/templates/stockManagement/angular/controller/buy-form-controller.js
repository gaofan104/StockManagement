// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.


stockManagement.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $http, $parse, item, order) {
    $scope.item1 = item;


    var order_id = null;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if (order){
        order_id = order.id;
        $scope.order_id = '/' + order.id;
        $scope.quantity = order.quantity;
        $scope.phone = order.phone;
        $scope.address={};
        angular.forEach(order.address.split(","), function(d,index){
            $parse("address._"+index).assign($scope, d);
        });
        $scope.status = order.status;
    } else{
        $scope.order_id = "";
        $scope.status = "已下单";
    }
//    console.log($scope.order_form);
    $scope.hello = "hello";
    $scope.ok = function(){
//      concatenate all subfields into a comma separated string in order to match the backend API field
        var str = [];
        angular.forEach($scope.address, function(value, key) {
            str.push(value);
        });
        $scope.address_new = str.join();

        var in_data = { item : $scope.item, buyer: $scope.buyer, quantity: $scope.quantity, phone: $scope.phone, address: $scope.address_new, id: order_id, status: $scope.status};
//        var in_data = { item : "123"};
        $http.post('/stockManagement/order_form/' + $scope.item + $scope.order_id, in_data).success(function(out_data) {
//            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close(in_data);
            $scope.alerts = [
//                { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
//                { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
            ];
            $scope.alerts.push({type: 'success',msg: 'Successfully Created the Order!'});
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        }).error(function(data, status, headers, config) {
            $scope.alerts = [];
            $scope.alerts.push({type:'danger', msg: data});
            var ifrm = document.getElementById('errorIFrame');
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write(data);
            ifrm.document.close();
        });

    }
});