'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AboutCtrl', function (financieraRequest, $scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    financieraRequest.get("rubro",
      $.param({
        query:"Id:35417",  //por rp
        limit:0,
      })
    ).then(function(response){
      $scope.rubros = response.data
        //console.log($scope.rubros)
    });
  });
