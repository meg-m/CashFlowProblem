'use strict';
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])


.service('friendService', function($http){
	function getFriendNames() 
	{
		var promise = $http({ method: 'GET', url: 'json/friends.json', cache : true });
		return promise;
	}
	return {getFriendNamesJson: getFriendNames}
})


.controller('View1Ctrl', [ '$scope', '$location', 'friendService', function($scope, $location, friendService) {

friendService.getFriendNamesJson()
.then(function success(response) {
	$scope.friends = response.data;
	$scope.noOfFriends = response.data.length;
});


var vm = this;
vm.navigateToCreate = function() {	
    $location.path('/view2');
}

$scope.showTable = false;
$scope.addNumber = function() {
	$scope.showTable = true;
}

$scope.addData = function() {

//$scope.friends.push( {'name':$scope.name} );
//$scope.friends.push( {'from':$scope.from, 'to':$scope.to, 'amt': $scope.amt} );
//$scope.name = '';
vm.navigateToCreate();
};



}]);