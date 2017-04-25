'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionConsultaFuenteCtrl
 * @description
 * # FuenteFinanciacionConsultaFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("fuente",function(){
        return {};
  })
  .controller('consultaFuenteCtrl', function ($window,fuente,$scope,$translate,financieraRequest) {

    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {displayName:$translate.instant('CODIGO'), field: 'Código',   cellTemplate:'<div align="center">{{row.entity.Codigo}}</div>' ,width: '20%',},
        {displayName:$translate.instant('SIGLA'), field: 'Sigla',    cellTemplate:'<div align="center">{{row.entity.Sigla}}</div>' ,width: '20%',},
        {displayName:$translate.instant('DESCRIPCION'),field: 'Descripcion', displayName : 'Descripción',width: '60%',},
      ]

    };
    self.gridOptions.multiSelect = false;
    financieraRequest.get('fuente_financiacion','limit=0').then(function(response) {
      self.gridOptions.data = response.data;
    });
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.fuente = fuente;
        $scope.fuente.Id = row.entity.Id;
        console.log(row.entity.Id);
        $window.location.href = '#/fuente_financiacion/detalle_fuente';
      });
    };
  });
