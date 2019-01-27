angular.module('allergan', ['ngRoute', 'ui.bootstrap']) //ngRoute and ui.bootstrap are dependencies used for this page
.config(allerganRouter).controller('allerganController', function ($scope) {

    $scope.loggedIn; //this variable checks if a user is logged in or not, if not looged in returns to LogIn page
    $scope.transferObject = null; // this variable carries object to be analysed to analysis page (third page)

    $scope.logOut = function () { // variable that keeps the user is cleared so that he comes back to the log in page

        $scope.loggedIn = "removed";
        $scope.transferObject = null;
        window.location.href = "#/";
    }

}).filter('levelFilter', function () { //Custom Filter for searching
    return function (accounts, name) {

        if (!accounts == "" && !name == "") {
            var account;
            var arrayToReturn = [];
            for (account in accounts) {
                if (accounts[account].accountLevel.name == name) {
                    arrayToReturn.push(accounts[account]);
                }
            }
            return arrayToReturn;
        }
        return accounts;
    }
});


function allerganRouter($routeProvider) { //route provider 

    $routeProvider
        .when('/', {
            templateUrl: 'views/logIn.html',
            controller: 'logInPage'
        })
        .when('/recordsHolder', {
            templateUrl: 'views/accountsDisplay.html',
            controller: 'accountsDisplay'
        })
        .when('/accountDetails', {
            templateUrl: 'views/accountDetails.html',
            controller: 'detailAnalysis'
        })
        .otherwise({
            redirectTo: '/'
        });
};