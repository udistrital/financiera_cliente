'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:necesidad/necesidaListar
 * @description
 * # necesidad/necesidaListar
 */
angular.module('financieraClienteApp')
  .directive('necesidaListar', function ($translate, administrativaRequest, agoraRequest) {
    return {
      restrict: 'E',
      scope:{
          inputpestanaabierta: '=?',
          outputnecesidad: '=?',
        },

      templateUrl: 'views/directives/necesidad/necesida_listar.html',
      controller:function($scope){
        var self = this;

        self.gridOptions_necesidad = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [10, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 10,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Numero',
              displayName: $translate.instant('DOCUMENTO'),
              cellClass: 'input_center',
              width:'11%',
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width:'9%',
            },
            {
              field: 'Valor',
              displayName: $translate.instant('VALOR'),
              width:'11%',
            },
            {
              field: 'DiasDuracion',
              displayName: $translate.instant('DURACION'),
              width:'9%',
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
              width:'10%',
            },
            {
              field: 'Objeto',
              displayName: $translate.instant('OBJETO'),
            },
            {
              field: 'Justificacion',
              displayName: $translate.instant('JUSTIFICACION'),
            },
          ]
        };
        //
        administrativaRequest.get('necesidad',
          $.param({
            limit: -1
          })).then(function(response) {
          self.gridOptions_necesidad.data = response.data;
        });
        //
        self.gridOptions_necesidad.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputnecesidad = row.entity
          });
        };
        self.gridOptions_necesidad.multiSelect = false;
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })


        // fin
      },
      controllerAs:'d_necesidaListar'
    };
  });
