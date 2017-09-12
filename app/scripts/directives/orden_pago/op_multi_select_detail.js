'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelectDetail
 * @description
 * # ordenPago/opMultiSelectDetail
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelectDetail', function (financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope:{
          inputopselect:'=?',
          inputvisible: '=?'
        },

      templateUrl: 'views/directives/orden_pago/op_multi_select_detail.html',
      controller:function($scope){
        var self = this;
        //
        self.gridOptions_op_detail = {
          showColumnFooter: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [15, 30, 45],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 15,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'FechaCreacion',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'TipoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('TIPO_DOCUMENTO')
            },
            {
              field: 'Nomina',
              width: '10%',
              displayName: $translate.instant('NOMINA')
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA')
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE')
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'ValorTotal',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_right',
              displayName: $translate.instant('VALOR'),

              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellFilter: 'currency',
              footerCellClass: 'input_right'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO')
            },
          ]
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // data
        $scope.$watch('inputopselect', function() {
          if ($scope.inputopselect != undefined) {
            self.gridOptions_op_detail.data = [];
            self.gridOptions_op_detail.data.push($scope.inputopselect);
          }
        },true)
        //
        self.gridOptions_op_detail.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = row.entity;
          });
        };
        //
        self.gridOptions_op_detail.multiSelect = true;
        self.gridOptions_op_detail.enablePaginationControls = true;
        // fin
      },
      controllerAs:'d_opMultiSelectDetail'
    };
  });
