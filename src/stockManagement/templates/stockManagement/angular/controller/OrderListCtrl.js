stockManagement.controller('OrderListCtrl', function ($timeout, $scope, $http, $uibModal, $log, DTOptionsBuilder, DTColumnDefBuilder, $route, OrderList, DTColumnBuilder, UserList) {

    $scope.order_table = {};

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withBootstrap()
        // Overriding the classes
        .withBootstrapOptions({
            TableTools: {
                classes: {
                    container: 'btn-group pull-right',
                    buttons: {
                        normal: 'btn btn-primary'
                    }
                }
            },
            ColVis: {
                classes: {
                    masterButton: 'btn btn-primary pull-right'
                }
            }
        })
        // Add ColVis compatibility
        .withColVis()
        // Add Table tools compatibility
        .withTableTools('//cdn.datatables.net/tabletools/2.2.2/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons([
            'copy',
            'print', {
                'sExtends': 'collection',
                'sButtonText': 'Save',
                'aButtons': ['csv', 'xls', 'pdf']
            }
        ]);

//  get all orders
    OrderList.query(function(response){
        $scope.orders = response;
    });

//  get all users
    UserList.query(function(response){
        $scope.users = response;
    }, function(error){
        var ifrm = document.getElementById('errorIFrame');
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write(error.data);
            ifrm.document.close();
    });

    // modal related
    $scope.animationsEnabled = true;
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.updated_orders = [];
    $scope.$watch('orders', function(newValue, oldValue){
        if(oldValue){
            angular.forEach(newValue, function(d, i){
                if(!angular.equals(d, oldValue[i])){
                    $scope.updated_orders.push(d);
                };
            });
        };
    }, true);

//  watch order list changes
    $scope.updateOrderList= function(){
//      clear existing alerts
        $scope.alerts = [];
        $scope.updated_orders = _.map($scope.updated_orders, function(o) { return _.omit(o, 'item_details'); });
        $scope.updated_orders = _.map($scope.updated_orders, function(o) { return _.omit(o, 'buyer_details'); });
        $scope.updated_orders = _.map($scope.updated_orders, function(o) { o.item = o.item.toString(); return o; });
        $scope.updated_orders = _.map($scope.updated_orders, function(o) { o.buyer = o.buyer.toString(); return o; });
        $scope.server_msg = "Processing...";
        $http.post('/stockManagement/orders/update',$scope.updated_orders).success(function(data, status){
            $scope.server_msg = "";
            $scope.alerts = [];
            if(data == "successful"){
                $scope.alerts.push({type:'success', msg: "All The Records are Updated"});
            }else{
                $scope.alerts.push({type:'warning', msg: "No Record to be Updated"});
            }
            $scope.updated_orders = [];
        }).error(function(data){
            $scope.alerts = [];
            $scope.alerts.push({type:'danger', msg: data.data});
            var ifrm = document.getElementById('errorIFrame');
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write(data);
            ifrm.document.close();
        });
    };

//  update record
    $scope.open = function (item, order) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/stockManagement/order_form/' + order.item_details.id +'/' + order.id,
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            item: function() {
              return order.item_details;
            },
            order: function() {
              return order;
            }
          }
        });

        // update the data in scope variable - orders so that the change take effect in the table immediately without a
        // new request to server to refresh the page
        modalInstance.result.then(function (order, alerts) {
//            $route.reload();
            var match = _.find($scope.orders, function(item) { return item.id === order.id });
            if (match) {
                match.quantity = order.quantity;
                match.phone = order.phone;
                match.address = order.address;
            };
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

//  delete record
    $scope.delete = function(item, order){
         $http.delete('/stockManagement/order_form/' + order.item_details.id +'/' + order.id).success(function(out_data) {
            console.log($scope.orders);
            console.log("deleted");

            $scope.orders = _.without($scope.orders, _.findWhere($scope.orders, {id: order.id}));
//            $route.reload();
        }).error(function(data, status, headers, config) {
            var ifrm = document.getElementById('errorIFrame');
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write(data);
            ifrm.document.close();
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    };

    $scope.select = {};
    $scope.select.all = false;
    $scope.selected = [];
//  dataTable bulk operations
    $scope.toggleAll = function () {
        var oTable = $scope.order_table.dataTable;
        var anNodes = $("#orderListTable tbody tr");
        for (var i = 0; i < anNodes.length; ++i) {
            var rowData = oTable.fnGetData(anNodes[i]);
//          first column of the table is the id
            $scope.selected[rowData[0]] = $scope.select.all;
        };

    };


    $scope.deal = function(){
        var out = _.filter($scope.orders, function(val, index){
            if($scope.selected[val.id]){
                val.status = "已成交";
                $scope.updated_orders.push(val);
            };
            return $scope.selected[val.id]
        });
        $scope.updateOrderList();
    };

    $scope.deliver = function(){
        var out = _.filter($scope.orders, function(val, index){
            if($scope.selected[val.id]){
                console.log(val);
                val.status = "配送中";
                $scope.updated_orders.push(val);
            };
            return $scope.selected[val.id]
        });
        $scope.updateOrderList();
    };
});