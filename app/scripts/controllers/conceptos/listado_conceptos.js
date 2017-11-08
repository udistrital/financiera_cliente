'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ConceptosListadoConceptosCtrl
 * @description
 * # ConceptosListadoConceptosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ListadoConceptosCtrl', function ($scope,$translate,$location) {
    $scope.btneditar=$translate.instant('BTN.EDITAR');

    $scope.$watch('concepto',
    function(){
      if ($scope.concepto!==undefined) {
        $location.path('conceptos/editar/'+$scope.concepto.Codigo); 
        console.log($scope.concepto);
      }
    },true)

  });
