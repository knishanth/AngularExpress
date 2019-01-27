function detailAnalysis($scope, $http) {

    if ($scope.$parent.transferObject === undefined || $scope.$parent.transferObject == null) {
        window.location.href = "#/";
        $('.overlayContainer').hide();
    }

    $scope.details = $scope.$parent.transferObject; // Received Object

    $scope.soldToImageDisplay = function () { //Checking for sold to account
        if (($scope.details.accountType).indexOf("soldto") > -1) {
            return true;
        } else {
            return false;
        }
    }
    $scope.shipToImageDisplay = function () { //Checking for ship to account
        if (($scope.details.accountType).indexOf("shipto") > -1) {
            return true;
        } else {
            return false;
        }
    }

    $scope.previousPage = function ($scope) { //propogating to previous page
        window.location.href = '#/recordsHolder';
    }


    /*Pyramid*/
    var pyramidElement = document.getElementById("mypyramid");
    var pyramidView = pyramidElement.getContext("2d");


    /*Text for around canvas*/

    pyramidView.font = "10px Arial";
    pyramidView.fillStyle = "#fff";

    pyramidView.fillText("Black Diamond", 90, 90, 70);
    pyramidView.fillText("1300 PTS", 235, 70, 70);

    pyramidView.fillText("Diamond", 92, 140, 70);
    pyramidView.fillText("900 PTS", 260, 125, 70);

    pyramidView.fillText("Platinum Plus", 50, 180, 70);
    pyramidView.fillText("600 PTS", 280, 165, 70);

    pyramidView.fillText("Platinum", 45, 225, 70);
    pyramidView.fillText("350 PTS", 305, 210, 70);

    pyramidView.fillText("Gold", 45, 270, 70);
    pyramidView.fillText("150 PTS", 325, 255, 70);

    pyramidView.fillText("Silver", 15, 320, 70);
    pyramidView.fillText("30 PTS", 355, 300, 70);



    var pointsContainer = [0, 30, 150, 350, 600, 900, 1300]; //points levels for threshold calculation
    var points = $scope.details.points;

    for (var pointCheck = 0; pointCheck < pointsContainer.length; pointCheck++) {

        if (pointsContainer[pointCheck] > points) {
            break;
        }
    }

    pointsRequired = pointsContainer[pointCheck] - points; //Required points to reach next level



    var height = 272;
    var width = 300;
    var x1 = width / 2 + 50; //x co-ordinate of top vertex of pyramid
    var y1 = 65; //y co-ordinate of top vertex of pyramid
    var top_y = 65; //x co-ordinate of top vertex of pyramid for top50 levels
    var top_x = width / 2 + 50; //x co-ordinate of top vertex of pyramid for top50 levels

    //different level phases
    var l = ["#0D6386", "#187DA5", "#1B98C9", "#30b0e3", "#4dbce8", "#74cff2"]; // color code set, to fill in different levels on pyramid					
    var x2 = x1 - (width / 2);
    var y2 = y1 + height;
    var x3 = x1 + (width / 2);




    for (var i = 0; i < 6; i++) { // this for loop creates required number of ranges on canvas
        pyramidView.beginPath();
        pyramidView.moveTo(x2, y2);
        x2 = x2 + (width / 12);
        pyramidView.lineTo(x3, y2);
        y2 = y2 - (height / 6);
        x3 = x3 - (width / 12);
        pyramidView.lineTo(x3, y2);
        pyramidView.lineTo(x2, y2);
        pyramidView.fillStyle = l[i];
        pyramidView.closePath();
        pyramidView.fill();
    }


    //cordinates for performing level range	

    x1 = x1 - (width / 2);
    x2 = x1 + width;
    x3 = (x1 + x2) / 2;
    y1 = (height + y1);
    var y2 = (y1 - height);

    //calculating slopes of the lines

    var m1 = (-y2 + y1) / (x3 - x1);
    var m2 = (-y2 + y1) / (x3 - x2);
    var constant1 = -y2 - (m1 * x3);
    var constant2 = -y2 - (m2 * x3);



    // Top 50 level on canvas

    var rhombusBottomY = 65 + (((1300 - 980) / (1300 - 900)) * height / 6);
    var midPoint = (top_y + rhombusBottomY) / 2;
    var leftpointX = (-midPoint - constant1) / m1;
    var rightPointX = (-midPoint - constant2) / m2;
    pyramidView.beginPath();
    pyramidView.moveTo(top_x, top_y);
    pyramidView.lineTo(rightPointX, midPoint);
    pyramidView.lineTo(top_x, rhombusBottomY);
    pyramidView.lineTo(leftpointX, midPoint);
    pyramidView.fillStyle = "#fff";
    pyramidView.closePath();
    pyramidView.fill();

    pyramidView.font = "10px Arial bold";
    pyramidView.fillStyle = "#000";
    pyramidView.fillText("Top", leftpointX + 5, midPoint - 2, 10);
    pyramidView.fillText("50", leftpointX + 5, midPoint + 10, 10);



    //calculating height according to points contained						

    heightCalculation = function (points, absoluteHeight) {

        for (var pointCheck = 0; pointCheck < pointsContainer.length; pointCheck++) {

            if (pointsContainer[pointCheck] > points) {
                break;
            }
        }
        var higherThreshold = pointsContainer[pointCheck];
        var lowerThreshold = pointsContainer[pointCheck - 1];

        var relativeHeight = (points - lowerThreshold) / (higherThreshold - lowerThreshold) * absoluteHeight / 6;
        absoluteHeight = (pointCheck - 1) * absoluteHeight / 6;
        return relativeHeight + absoluteHeight;
    }

    var pointsHeight = heightCalculation($scope.details.points, height);
    var x4 = (-y1 + pointsHeight - constant1) / m1;
    var x5 = (-y1 + pointsHeight - constant2) / m2;
    pyramidView.beginPath();
    pyramidView.moveTo(x1, y1);
    pyramidView.lineTo(x1 + width, y1);
    pyramidView.lineTo(x5, y1 - pointsHeight);
    pyramidView.lineTo(x4, y1 - pointsHeight);

    pyramidView.fillStyle = "rgba(57,224,145,5)";
    pyramidView.closePath();
    pyramidView.fill();

    pyramidView.font = "15px Tahoma solid"
    pyramidView.fillStyle = "#fff";
    pyramidView.fillText(points + " - PTS", 185, 283, 170);
    pyramidView.fillText("Points required for next Level - " + pointsRequired + " PTS", 95, 320, 220);
    pyramidView.fillStyle = "#7d7d80";
    pyramidView.fillText("Current Level - " + $scope.details.accountLevel.name, 125, 302, 250);



    /*Kicker*/

    $scope.settingImages = function (index, parentIndex) { //calculates number of kicker points for each level using parentIndex

        $scope.length = $scope.details.accountName.productInformation[parentIndex].kickerPoints;
        if (index < $scope.length) {
            $scope.path = "cube-active.png";
            return true;
        } else {
            $scope.path = "cube.png";
            return true;
        }
    };

    /*Scroll To*/
    $scope.scrollToContent = function (index, event) {
        console.log(index);
        var target = event.target;
        var parent = target.parentNode;
        var targetDiv = parent.nextElementSibling;
        var targetContent = $("#tierContent").children()[index];
        console.log(targetContent);
        $("#tierContent").animate({
            scrollTop: targetContent.offsetTop - 170
        }, "slow");

    };

    /*Tiers*/

    for (i in $scope.details.accountName.productInformation) { //checks for productname and passes corrresponding info to corresponding canvas

        if ($scope.details.accountName.productInformation[i].productName === "Botox") { //Botox is called seperately as it is static 
            Botox($scope.details.accountName.productInformation[i]);
        } else
            canvas($scope.details.accountName.productInformation[i], i - 1); //Other tier levels are called dynamically
    }
    0

}

var tierObjectHolder = [ // Object that contains id's and pointLists
    {
        "id": "juvedermTier",
        "pointslist": ["20PTS", "75PTS", "75PTS", "150PTS", "20PTS"]
    }, {
        "id": "natrellaTier",
        "pointslist": ["0PTS", "15PTS", "30PTS", "45PTS", "0PTS"]
    }, {
        "id": "viveteTier",
        "pointslist": ["0PTS", "10PTS", "30PTS", "75PTS", "0PTS"]
    }, {
        "id": "latiseeTier",
        "pointslist": ["20PTS", "75PTS", "75PTS", "150PTS", "20PTS"]
    }

]

function canvas(product, index) { //passing corresponding product information to canvas
    var currentCanvas = document.getElementById(tierObjectHolder[index].id);
    var pointslist = tierObjectHolder[index].pointslist;
    rectanglecanvas(currentCanvas, product, pointslist);
}

function Botox(product) { // Botox canvas, with text around it
    var botoxCanvas = document.getElementById("botoxTier");
    var botoxCanvasView = botoxCanvas.getContext("2d");
    var height = 180;
    var width = 56;
    var x_coordinate = 54;
    var y_coordinate = -1;
    botoxCanvasView.fillStyle = "#8378ab";
    botoxCanvasView.fillRect(x_coordinate, y_coordinate, 66, 176);

    botoxCanvasView.font = "25px Arial";
    botoxCanvasView.fillStyle = "#fff";
    y_coordinate = height - 15;
    botoxCanvasView.fillText(product.tierpoints.toString(), 65, y_coordinate);

    botoxCanvasView.fillStyle = "#6f9cb3";
    botoxCanvasView.font = "15px Arial bold";
    y_coordinate = y_coordinate + 30;
    botoxCanvasView.fillText("POINTS", 58, y_coordinate);

    y_coordinate = y_coordinate + 20;
    botoxCanvasView.font = "13px Arial BOLD";
    botoxCanvasView.fillStyle = "#6D7278";
    botoxCanvasView.fillText("POINTS IN 2011:10PTS", 15, y_coordinate);

    y_coordinate = y_coordinate + 20;
    botoxCanvasView.font = "15px Arial BOLD";
    botoxCanvasView.fillStyle = "#6f9cb3";
    botoxCanvasView.fillText(product.productName, 63, y_coordinate);
};

function rectanglecanvas(currentCanvas, product, pointslist) { //Dynamic cavas

    var tiernumber = product.tierLevel;
    var tierpoints = product.tierpoints;
    var productName = product.productName;
    var height = 175; //height of canvas
    var width = 62;
    var canvasView = currentCanvas.getContext("2d");
    var number_of_tiers = 5;
    var x_coordinate = 60;
    var y_coordinate = -2;
    var levelheight = (height / number_of_tiers) - 3;

    for (i = 0; i < (2 * number_of_tiers); i++) { //iterates 10 times and fills blue rectangles
        if (i % 2 == 0) {
            canvasView.fillStyle = "#139dd4";
            y_coordinate = y_coordinate + 3;
            canvasView.fillRect(x_coordinate, y_coordinate, 60, levelheight);
        } else if (i === ((2 * number_of_tiers) - 1)) { //last strip is manually built
            y_coordinate = y_coordinate + 32;
            canvasView.fillStyle = "#139dd4";
            canvasView.fillRect(x_coordinate, y_coordinate, 60, 2);
        } else {
            y_coordinate = y_coordinate + 32;
            canvasView.fillStyle = "rgba(0,63,92,1)";
            canvasView.fillRect(x_coordinate, y_coordinate, 60, 3);
        }
    }


    if (tiernumber != 0) { //if tier points are zero then text is displayed onlast tier
        canvasView.fillStyle = "#8378ab";
        canvasView.fillRect(x_coordinate, y_coordinate, 60, 2);
    }

    for (i - 1; i > 2 * (number_of_tiers - tiernumber); i--) {

        if (i % 2 == 0) { //filling next layer of canvas pink
            canvasView.fillStyle = "#8378ab";
            y_coordinate = y_coordinate - 32;
            canvasView.fillRect(x_coordinate, y_coordinate, 60, levelheight);
        } else {
            y_coordinate = y_coordinate - 3;
            canvasView.fillStyle = "rgba(0,63,92,0.3)";
            canvasView.fillRect(x_coordinate, y_coordinate, 60, 3);
        }
    }

    if (tiernumber === 0) {
        y_coordinate = y_coordinate - 30;
    }


    // Writing text on canvas

    var t1 = tierpoints.toString();
    canvasView.fillStyle = "rgba(255,255,255,1)";
    canvasView.font = "20px Arial";
    canvasView.fillText(t1, 78, y_coordinate + 25);

    var a = ["2%", "4%", "6%", "8%", "2%"];
    canvasView.fillStyle = "#748f99";
    canvasView.font = "10px Arial";
    y_coordinate = 24;
    for (i = 0; i < number_of_tiers; i++) {
        canvasView.fillText(pointslist[i].toString(), 15, y_coordinate);
        canvasView.fillText(a[i].toString(), 130, y_coordinate);
        y_coordinate = y_coordinate + 35;
    }

    canvasView.fillStyle = "#748f99";
    canvasView.font = "10px Arial";
    y_coordinate = y_coordinate - 10;
    canvasView.fillText("10 POINTS TO NEXT LEVEL", 15, y_coordinate);

    y_coordinate = y_coordinate + 15;
    canvasView.font = "13px Arial BOLD";
    canvasView.fillStyle = "#6D7278";
    canvasView.fillText("POINTS IN 2011:10PTS", 15, y_coordinate);

    y_coordinate = y_coordinate + 25;
    canvasView.font = "17px Arial BOLD";
    canvasView.fillStyle = "#6f9cb3";
    canvasView.fillText(productName, 62.5, y_coordinate);
    $('.overlayContainer').hide();
}