var matchingPairs = angular.module('matchingPairs', []);

matchingPairs.controller('pairsController', function ($scope, $compile) {
	$scope.showChoice = true;
	$scope.showBoard = false;
	$scope.showClics = false;
	$scope.showGameOver = false;
	$scope.clics = 0;
	
	$scope.begin = function(level) {
		$scope.showChoice = false;
		$scope.showBoard = true;
		$scope.showClics = true;
		$scope.showGameOver = false;
		$scope.clics = 0;
		$scope.createBoard(level);
	};
	
	$scope.createBoard = function(level) {
		var row = 0;
		var column = 0;
		var counter = 0;
		$scope.units = [];
		
		var numbers=generate(level);
		var board = angular.element(document.getElementById("board"));
		board.html("");
		
		while (row < level) {
			while (column < level) {
				if (level == 5 && row == 2 && column == 2) {
					board.append("<div id='unit_" + row + "_" + column + "' class='unit5blank'></div>");
					$scope.units["unit_" + row + "_" + column] = "X";
				} else {
					var template = "<div id='unit_" + row + "_" + column + "' class='unit unit" + level + "' ng-click='tap(\"unit_" + row + "_" + column + "\", " + level + ")'></div>";
					var content = $compile(template)($scope);
					board.append(content);
					var data = numbers[counter];
					$scope.units["unit_" + row + "_" + column] = data%2 == 0 ? data : data + 1;
					counter++;
				}
				column++;
			}
			column = 0;
			row++;
		}
		
		board.append("<div class='clear'></div>");
	};
	
	$scope.tap = function(id, level) {
		var div = angular.element(document.getElementById(id));
		var clicked = angular.element(document.getElementsByClassName("clicked"));
		
		if(clicked.length < 2) {
			if (!div.hasClass("clicked") && !div.hasClass("discovered")) {
				var index = $scope.units[id] / 2 - 1;	
				var color = selectColor(index);
				div.css("background-color", color);
				div.html("<span class='number'>" + (parseInt(index) + 1) + "</span>");
				
				if(clicked.length == 1) {
					$scope.clics++;
					if (clicked.html() == div.html()) {
						clicked.removeClass("clicked");
						clicked.addClass("discovered");
						div.addClass("discovered");
						if (document.getElementsByClassName("discovered").length >= (level * level - 1)) {
							$scope.showGameOver = true;
							$scope.showChoice = true;
							$scope.showBoard = false;
						}
					} else {
						setTimeout(function(){
							clicked.removeClass("clicked");
							clicked.removeAttr("style");
							clicked.html("");
							div.removeAttr("style");
							div.html("");
						},800);
					}
				} else
					div.addClass("clicked");
			}
		}
	};
});

/* Auxiliar functions */

function generate(level) {
	var rows = [];
	var limit = level == 5 ? 24 : level * level;
	
	for (var i = 0; i < (limit); i++) {
		var rand = Math.floor((Math.random()*limit)+1)
		while (rows.indexOf(rand) != -1) {
			rand = Math.floor((Math.random()*limit)+1)
		}
		rows.push(rand);
	}
	
	return rows;
}

function selectColor(index) {
	var colors = new Array ("#DDDDDD", "#FF0000", "#00FF00", "#0000FF", "#555555", "#550000", "#005500", "#000055", "#AAAAAA", "#AA0000", "#00AA00", "#0000AA", "#000000", "#00FFFF", "#FF00FF", "#FFFF00", "#0077FF", "#FF7700");	
	return colors[index];
}
