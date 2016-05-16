// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.


stockManagement.controller('FileUploadDemoCtrl', function ($scope, $http, $parse, Upload, $timeout) {
    $scope.uploadFiles = function (files) {
        $scope.files = files;
        console.log(files);
        if (files && files.length) {
            Upload.upload({
                url: 'stockManagement/files/',
                data: {
                    file: files
                }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
                var ifrm = document.getElementById('errorIFrame');
                ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
                ifrm.document.open();
                ifrm.document.write(response.data);
                ifrm.document.close();
            }, function (evt) {
                $scope.progress =
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
});