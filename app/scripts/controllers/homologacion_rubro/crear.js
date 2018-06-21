'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionRubroCrearCtrl
 * @description
 * # HomologacionRubroCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionRubroCrearCtrl', function ($scope,$translate,financieraMidRequest) {
    var ctrl = this;

    ctrl.gridrubros = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableSelectAll: false,
      enableRowHeaderSelection: true,
      selectionRowHeaderWidth: 35,
      columnDefs: [
          {
              field: 'Devolucion.Id',
              displayName: $translate.instant('NUMERO_OPERACION'),
              headerCellClass:'text-info',
              width: '25%'
          },
          {
              field: 'Devolucion.FormaPago.Nombre',
              displayName: $translate.instant('NOMBRE'),
              headerCellClass:'text-info',
              width: '25%',
          },
          {
              field: 'Devolucion.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '25%'
          },
          {
              field: 'Devolucion.Vigencia',
              displayName: $translate.instant('ENTIDAD'),
              headerCellClass:'text-info',
              width: '25%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        });
      }
    };

    ctrl.consultarRubrosHomologacion = function(){
      financieraMidRequest.get("rubro_homologado").then(function(response){
          console.log(response.data);
      });
    }
    ctrl.consultarRubrosHomologacion();
    ctrl.creacionRubro=function(){
      $('#modal').modal();
    }
  });
