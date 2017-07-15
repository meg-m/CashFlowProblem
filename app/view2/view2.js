'use strict';
angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.service('transactionService', function($http) {
	function getTransactions() 
	{
		var promise = $http({ method: 'GET', url: 'json/transactions.json', cache : true });
		return promise;
	}
	return {getTransactionsJson: getTransactions}
})

.service('friendService', function($http) {
	function getFriends() 
	{
		var promise = $http({ method: 'GET', url: 'json/friends.json', cache : true });
		return promise;
	}
	return {getFriendsJson: getFriends}
})

.controller('View2Ctrl', ['$scope', '$http', 'transactionService', 'friendService', 
	function($scope, $http, transactionService, friendService) {

transactionService.getTransactionsJson()
.then(function success(response) {
	$scope.transactions = response.data;
});

friendService.getFriendsJson()
.then(function success(response) {
        $scope.friends = response.data;  
        $scope.noOfFriends = response.data.length;        
});

var vm = this;
vm.minOf2 = function()
{
    return (arguments[0]<arguments[1])? arguments[0]: arguments[1];
}

vm.minCashFlowRec = function()
{

    var mxCredit = 0, mxDebit=0, i;

    for (i=1; i< $scope.noOfFriends; i++)
        if (vm.amount[i] < vm.amount[mxDebit])
            mxDebit = i;

    for (i=1; i< $scope.noOfFriends; i++)
        if (vm.amount[i] > vm.amount[mxCredit])
            mxCredit = i;

    if (vm.amount[mxCredit] == 0 && vm.amount[mxDebit] == 0)
        return;
    var min = vm.minOf2(-vm.amount[mxDebit], vm.amount[mxCredit]);
    vm.amount[mxCredit] -= min;
    vm.amount[mxDebit] += min;
 
    console.log(mxDebit+" pays "+min+" to "+mxCredit);

    vm.minCashFlowRec(vm.amount);
}

$scope.minimizeCashFlow= function() {
	var g = new Array($scope.noOfFriends), i, j;

	for(i=0; i<$scope.noOfFriends;i++)
		g[i] = new Array($scope.noOfFriends);

	for(i=0; i<$scope.noOfFriends;i++)
		for(j=0; j<$scope.noOfFriends;j++)
			g[i][j] = 0;


	for (i=0; i< $scope.transactions.length; i++) 
	{
			g[parseInt($scope.transactions[i].from)][parseInt($scope.transactions[i].to)] = parseInt($scope.transactions[i].amt);	
	}	

	vm.amount= new Array($scope.noOfFriends) ;
	for(var i=0; i<$scope.noOfFriends;i++)
		vm.amount[i] = 0;
 	
    for (var p=0; p< $scope.noOfFriends; p++)
     	for (var i=0; i<$scope.noOfFriends; i++)
    		vm.amount[p] += (g[i][p] -  g[p][i]);
   
    vm.minCashFlowRec(vm.amount);
}

}]);