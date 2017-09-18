'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelect
 * @description
 * # ordenPago/opMultiSelect
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelect', function (financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope:{
          inputestado:'=?',
          outputopselect: '=?',
          outputvisible: '=?'
        },
      templateUrl: 'views/directives/orden_pago/op_multi_select.html',
      controller:function($scope){
        var self = this;
        $scope.outputvisible = true;

        self.confirmar = function(){
          $scope.outputvisible = false;
        }
        //
        self.gridOptions_op = {
          showColumnFooter: false,
          enableRowSelection: true,
          enableRowHeaderSelection: true,

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
              field: 'FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO')
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
              displayName: $translate.instant('VALOR')
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
        $scope.$watch('tiponomina', function() {
          if ($scope.inputestado != undefined && $scope.tiponomina != undefined) {
            financieraRequest.get('orden_pago',
              $.param({
                query: "Nomina:" + $scope.tiponomina + ",OrdenPagoEstadoOrdenPago.EstadoOrdenPago.CodigoAbreviacion:" + $scope.inputestado,
              })).then(function(response) {
              self.refresh();
              self.gridOptions_op.data = response.data;
              // data proveedor
              angular.forEach(self.gridOptions_op.data, function(iterador){
                agoraRequest.get('informacion_proveedor',
                  $.param({
                    query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
                  })
                ).then(function(response) {
                  iterador.Proveedor = response.data[0];
                });
                financieraRequest.post('orden_pago/ValorTotal/' + iterador.Id ,
                ).then(function(response) {
                  iterador.ValorTotal = response.data;
                });
              })
              // data proveedor
            });
          }
        },true)
        //
        self.gridOptions_op.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = self.gridApi.selection.getSelectedRows();
          });
        };
        //
        self.gridOptions_op.multiSelect = true;
        self.gridOptions_op.enablePaginationControls = true;
        // fin
      },
      controllerAs:'d_opMultiSelect'
    };
  });
