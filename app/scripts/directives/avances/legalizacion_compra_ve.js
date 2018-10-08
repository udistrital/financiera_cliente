'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:avances/legalizacionCompraVe
 * @description
 * # avances/legalizacionCompraVe
 */
angular.module('financieraClienteApp')
  .directive('legalizacionCompraVe', function () {
    return {
      restrict: 'E',
      scope:{
          legalizacion:'=',
          ver:'=?',
        },
      templateUrl: 'views/directives/avance/legalizacion_compra_ve.html',
      controller:function($scope,$attrs,financieraRequest,$translate,$interval){
        var ctrl = this;
        ctrl.ver = JSON.parse($scope.ver);
        console.log(typeof(ctrl.ver));
        ctrl.concepto = [];
        ctrl.LegalizacionCompras = $scope.legalizacion;
        ctrl.Impuesto = [];
        ctrl.gridImpuestos = {
            paginationPageSizes: [5, 10, 15],
            paginationPageSize: 5,
            enableFiltering: true,
            enableRowHeaderSelection:false,
            enableRowSelection:false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [{
                    field: 'Id',
                    displayName: $translate.instant('ID'),
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                    width: '12.5%'
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                },
                {
                    field: 'TarifaUvt',
                    displayName: $translate.instant('UVT'),
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                },
                {
                    field: 'Porcentaje',
                    displayName: $translate.instant('PORCENTAJE'),
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                },
                {
                    field: 'Deducible',
                    displayName: $translate.instant('DEDUCIBLE'),
                    cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.Deducible" disabled></center>',
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                },
                {
                    field: 'CuentaContable.Codigo',
                    displayName: $translate.instant('CODIGO_CUENTA'),
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                },
                {
                    field: 'TipoCuentaEspecial.Nombre',
                    displayName: $translate.instant('TIPO'),
                    width: '12.5%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                }
            ]
        };
        ctrl.gridImpuestos.onRegisterApi = function (gridApi) {
                    ctrl.gridImpuestosApi = gridApi;
            }
        ctrl.cargarImpuestos=function(){
            financieraRequest.get('avance_legalizacion_tipo/GetTaxesMovsLegalization',$.param({
              noTipoDoc:8,
              idLegTipo:ctrl.LegalizacionCompras.Id
            })).then(function(response){
              ctrl.Impuesto = response.data.impuestos;
              ctrl.gridImpuestos.data = response.data.impuestos;
              ctrl.concepto[0].movimientos = response.data.movimientos;
              ctrl.calcular_valor_impuesto();
            });
        }

        ctrl.getConcepto=function(){
          financieraRequest.get('concepto_avance_legalizacion_tipo',$.param({
            query:"AvanceLegalizacion.Id:"+ctrl.LegalizacionCompras.Id,
            limit:1
          })).then(function(response){
              ctrl.concepto[0]=response.data[0].Concepto;
              $scope.nodo = response.data[0].Concepto;
              ctrl.cargarImpuestos();
          });
        }
        ctrl.getConcepto();
        ctrl.calcular_valor_impuesto = function() {
            var sum_impuestos = 0;
            ctrl.Total = 0;
            ctrl.subtotal = 0;
            for (var i in ctrl.Impuesto) {
                if (ctrl.Impuesto[i].Id === 56) {
                    if (!angular.isUndefined(ctrl.Impuesto.IVA)) {
                        ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.Impuesto.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor;
                    } else {
                        ctrl.Impuesto[i].Valor = 0;
                    }
                } else {
                    ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.LegalizacionCompras.Valor;
                }
                if (!angular.isUndefined(ctrl.Impuesto[i].Valor) && ctrl.Impuesto[i].TipoCuentaEspecial.Id !== 3) {
                    sum_impuestos += ctrl.Impuesto[i].Valor;
                }
            }
            ctrl.IVA = ctrl.Impuesto.find(function(item){
              return(item.TipoCuentaEspecial.Id===3);
            });
            if (angular.isUndefined(ctrl.IVA)) {
                ctrl.subtotal = ctrl.LegalizacionCompras.Valor;
            } else {
                ctrl.subtotal = ctrl.LegalizacionCompras.Valor + (ctrl.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor);
            }
            ctrl.Total = ctrl.subtotal - sum_impuestos;
        };
        $scope.$watch('d', function() {
            if($scope.d){
              $interval( function() {
                  ctrl.gridImpuestosApi.core.handleWindowResize();
                }, 500, 2);


            }
          });
      },
      controllerAs:'d_legalizacionCompraVe'
    };
  });
