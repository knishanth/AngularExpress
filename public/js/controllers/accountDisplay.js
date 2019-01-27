function accountsDisplay($scope, $http) {

    console.log($scope.$parent.loggedIn);
    if ($scope.$parent.loggedIn === undefined || $scope.$parent.loggedIn == "removed") {
        window.location.href = "#/";
        $('.overlayContainer').hide();
    }


    //default initialisation
    $scope.clickCount = 1;
    $scope.more = true;
    $scope.less = false;
    $scope.isCollapsed = true;
    $scope.selectedLevel = null;
    $scope.search = null;
    $scope.reverse = true;
    $scope.predicate = "points";
    $scope.levelList = [];
    $scope.sortby = "points";
    $scope.checkreverse = true;
    $scope.sortingorder = true;
    $scope.check = true;


    $('.overlayContainer').show();
    var response = $http.get("data/accountsContainer.json");
    response.success(function (data, status) {
        $scope.data = data;
        $('.overlayContainer').hide();
        $scope.accountsList = {
            "accounts": []
        };
        $scope.accountsPerPage = 50;
        $scope.totalAccounts = data.accounts.length;
        $scope.pageCount = Math.ceil($scope.totalAccounts / $scope.accountsPerPage);
        $scope.clickCount = 1;
        $scope.more = true;
        for (var i = 0; i < (50 * $scope.clickCount); i++) {
            $scope.accountsList.accounts[i] = $scope.data.accounts[i];
        }
        $scope.status_bar = "Showing " + ($scope.accountsList.accounts.length === 0 ? "0" : "1") +
            " to " + ($scope.accountsList.accounts.length) + " of " + ($scope.data.accounts.length) + " entries";

        $scope.loadMore = function () { // retrieves data on each click
            $('.overlayContainer').show();

            var response = $http.get("data/accountsContainer.json");
            response.success(function (data, status) {
                $scope.data = data;
                //console.log("success");
                $('.overlayContainer').hide();

                $scope.accountsList = {
                    "accounts": []
                };
                for (var i = 0; i < (50 * $scope.clickCount); i++) {
                    if ($scope.accountsList.accounts.length < $scope.data.accounts.length) {
                        $scope.accountsList.accounts[i] = $scope.data.accounts[i];
                        $scope.getdata = $scope.accountsList.accounts;
                    }
                }
                if ($scope.clickCount === $scope.pageCount) {
                    $scope.more = false;
                }
                $scope.status_bar = "Showing " + ($scope.accountsList.accounts.length === 0 ? "0" : "1") +
                    " to " + ($scope.accountsList.accounts.length) + " of " + ($scope.data.accounts.length) + " entries";
            });
            response.error(function (data, status) {
                $('.overlayContainer').hide();
                alert("Unable to retrieve data !!!!!");
            });
        };

        $scope.showMore = function () {
            $scope.clickCount += 1;
            $scope.loadMore();
        };

        $scope.hasMore = function () {
            return $scope.more;
        };

    });
    response.error(function (data, status) {
        $('.overlayContainer').hide();
        alert("Unable to retrieve data !!!!!");
    });


    $scope.levels = function () { //Function for dynamically gettingthe level values

        for (var levelIndex = 0; levelIndex < $scope.accountsList.accounts.length; levelIndex++) {

            var present = 0;
            var level = $scope.accountsList.accounts[levelIndex].accountLevel.name;

            if ($scope.levelList.length === 0) {
                $scope.levelList[0] = {
                    "name": level
                };
            } else {
                for (var listCount = 0; listCount < $scope.levelList.length; listCount++) {
                    if (level === $scope.levelList[listCount].name) {
                        present = 1;
                    }
                }
                if (present === 0) {
                    $scope.levelList[listCount] = {
                        "name": level
                    };
                }
            }
        }
    }

    $scope.setSelectedaccount = function (index) { //setting selected account

        if ($scope.levelList[index].name == 'Silver Accounts and Above') {
            $scope.accountsList = {
                "accounts": []
            };
            $scope.init();
        }
        $scope.selectedLevel = $scope.levelList[index].name;
    };

    $scope.display = function (index) {
        $('#frontdisplay').text($scope.levelList[index].name); // displaying selected value
    };

    //go function
    $scope.goButton = function () { //go button functionality

        //error message 
        $('.overlayContainer').show();

        if ($scope.selectedLevel == null && $scope.search == null) {
            $scope.error = "Please select a category";
        } else {
            $scope.error = "";
            if ($scope.filtered.length == 0) {
                $scope.error = "Search results not found";
            }
            $scope.predicate = $scope.sortby;
            $scope.reverse = $scope.sortingorder;
            $scope.isCollapsed = true;
            $scope.getdata = $scope.accountsList.accounts;
            $scope.selectedLevelAfter = $scope.selectedLevel;
            $scope.searchtext = $scope.search;
            $scope.filtered = [];
            $scope.search = null;
        }
        $('.overlayContainer').hide();
    };


    //for default sorted selection
    $scope.checking = function () {
        if ($scope.predicate != $scope.sortby || $scope.predicate == $scope.sortby) {
            $scope.check = "false";
        }
        if ($scope.reverse != $scope.sortingorder || $scope.reverse == $scope.sortingorder) {
            $scope.checkreverse = "false";
        }
    };

    //reset function
    $scope.resetButton = function () {
        $('.overlayContainer').show();

        $scope.error = "";
        $scope.search = null;
        $scope.searchtext = "";
        $('#frontdisplay').text('Silver Accounts and above');
        $scope.filtered = null;
        $scope.selectedLevel = null;
        $scope.getdata = null;
        $scope.isCollapsed = true;
        $scope.clickCount = 1;
        $scope.more = true;
        var response = $http.get("data/accountsContainer.json");
        response.success(function (data, status) {
            $scope.data = data;
            $scope.accountsList = {
                "accounts": []
            };
            for (var i = 0; i < (50 * $scope.clickCount); i++) {
                if ($scope.accountsList.accounts.length < $scope.data.accounts.length) {
                    $scope.accountsList.accounts[i] = $scope.data.accounts[i];

                }
            }
            $scope.getdata = null;
            $scope.status_bar = "Showing " + ($scope.accountsList.accounts.length === 0 ? "0" : "1") +
                " to " + ($scope.accountsList.accounts.length) + " of " + ($scope.data.accounts.length) + " entries";

            $scope.hasMore = function () {
                return $scope.more;
            };
            $('.overlayContainer').hide();
        });
        response.error(function (data, status) {
            $('.overlayContainer').hide();
            alert("Unable to retrieve data !!!!!");

        });

    };

    //for sorting items
    $scope.sortSubmit = function () {

        // If some test is entered in search box then only this sort selection works
        $scope.isCollapsed = true;
        if ($scope.selectedLevel == null && $scope.search == null) {
            $scope.error = "Please select a category";
        }

        if ($scope.search != null || $scope.selectedLevel != null) {
            $scope.predicate = $scope.sortby;
            $scope.reverse = $scope.sortingorder;
        }

    };

    $scope.nextPage = function (index) { // selected object is carried forward to next page
        $scope.$parent.transferObject = $scope.filtered[index];
        window.location.href = '#/accountDetails';
    }

    $scope.hideDropDown = function () { // hiding drop down
        if ($scope.isCollapsed == false) {
            $scope.isCollapsed = true;
        }
    }


}