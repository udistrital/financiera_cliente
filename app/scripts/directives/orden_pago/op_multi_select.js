'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelect
 * @description
 * # ordenPago/opMultiSelect
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelect', function (financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
          inputestado:'=?',
          outputopselect: '=?'
        },
      templateUrl: 'views/directives/orden_pago/op_multi_select.html',
      controller:function($scope){
        var self = this;
        //
        self.gridOptions_op = {
          enableRowSelection: true,
          enableRowHeaderSelection: true,

          paginationPageSizes: [5, 10, 15],
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
              field: 'Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'FechaCreacion',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              cellFilter: "date:'yyyy-MM-dd'",
            },
            {
              field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '8%',
              cellClass: 'input_center'
            },
            {
              field: 'TipoOrdenPago.Nombre',
              displayName: $translate.instant('TIPO_DOCUMENTO')
            },
            {
              field: 'Nomina',
              displayName: $translate.instant('NOMINA')
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
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
        //
        $scope.$watch('inputestado', function() {
          if ($scope.inputestado != undefined) {
            financieraRequest.get('orden_pago',
              $.param({
                query: "OrdenPagoEstadoOrdenPago.EstadoOrdenPago.CodigoAbreviacion:" + $scope.inputestado,
              })).then(function(response) {
              self.refresh();
              self.gridOptions_op.data = response.data;
            });
          }
        },true)
        self.gridOptions_op.multiSelect = true;
        self.gridOptions_op.enablePaginationControls = true;
        // fin
      },
      controllerAs:'d_opMultiSelect'
    };
  });
