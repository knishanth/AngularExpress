$(document).ready(function () {
    $('.overlayContainer').hide();
});

function logInPage($scope, $http) {


    // $scope.$parent.loggedIn = undefined;
    console.log($scope.$parent.loggedIn);

    $scope.signIn = function () {
        $('.overlayContainer').show();
        if ($scope.userName === undefined || $scope.pass === undefined) {
            $('.overlayContainer').hide();
            $scope.error = "Unable to Log in. Please enter both Username and Password. "
        } else {
            $http.get('data/userDetails.json').success(function (data) { //Retrieves data for authentication              
                $scope.accountLogin = data;
                $('.overlayContainer').hide();
                var length = $scope.accountLogin.authentication.length;
                var valid = 0;

                for (var accountIndex = 0; accountIndex < length; accountIndex++) {

                    var username = $scope.accountLogin.authentication[accountIndex].userName;

                    if ($scope.userName === username) { //Checking for the user name

                        var password = $scope.accountLogin.authentication[accountIndex].password;

                        if ($scope.pass === password) {
                            $scope.$parent.loggedIn = "set";
                            console.log($scope.$parent.loggedIn);
                            window.location.href = "#/recordsHolder";

                        } else { //if user name matches but password is wrong
                            $scope.error = "Unable to Log in. Please enter your Password Correctly.";
                        }
                        valid = 1;
                        break;
                    }
                }
                if (valid === 0) {
                    $scope.error = "Unable to Log in. Please enter your Username."; //if username doesnot matche or not provided
                }

            });
        }
    }



    $scope.hideError = function () { // Hiding error message

        return $scope.error = false;
    }

    $scope.onEnter = function () { // funtion tovalidate credentialsif we press ENTER

        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    };
}