stockManagement.directive('testForm', function($timeout){
    return {
        link: function(scope){
        },
        restriction: 'E',
        scope: {
            user: '=name',
        },
        templateUrl: 'static/stockManagement/angular/directive-html/testForm.html'
    };
});
