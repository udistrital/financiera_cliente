'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl
 * @description
 * # TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('legalizacionEvtCompraCtrl', function ($scope,financieraRequest,$translate,$interval) {
    var ctrl = this;
    ctrl.LegalizacionCompras = { Valor: 0 };
    ctrl.seleccion = [];
    ctrl.Impuesto = [];
    ctrl.concepto = [];
    ctrl.Total = 0;
    ctrl.subtotal = 0;
    ctrl.gridImpuestos = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableFiltering: true,
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
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if(row.isSelected) {
                  row.entity.Valor = row.entity.Porcentaje * ctrl.LegalizacionCompras.Valor
                 ctrl.Impuesto.push(row.entity);
                 console.log("agrega",ctrl.Impuesto);
               }else{
                 ctrl.Impuesto.splice(ctrl.seleccion.indexOf(row.entity), 1);
               }
               ctrl.calcular_valor_impuesto ();
                });
            }
    ctrl.cargar_impuestos = function() {
        financieraRequest.get("cuenta_especial",
                $.param({
                    limit: -1,
                    query: "TipoCuentaEspecial.Id__in:2|3|4|5"

                }))
            .then(function(response) {
                ctrl.gridImpuestos.data = response.data;
              });
            }
    ctrl.cargar_impuestos();
    ctrl.calcular_valor_impuesto = function() {
        var sum_impuestos = 0;
        ctrl.Total = 0;
        ctrl.subtotal = 0;
        for (var i in ctrl.Impuesto) {
            if (i === "rete_iva") {
                if (!angular.isUndefined(ctrl.Impuesto.IVA)) {
                    ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.Impuesto.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor;
                } else {
                    ctrl.Impuesto[i].Valor = 0;
                }
            } else {
                ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.LegalizacionCompras.Valor;
            }
            if (!angular.isUndefined(ctrl.Impuesto[i].Valor) && i !== "IVA") {
                sum_impuestos += ctrl.Impuesto[i].Valor;
            }
        }
        if (angular.isUndefined(ctrl.Impuesto.IVA)) {
            ctrl.subtotal = ctrl.LegalizacionCompras.Valor;
        } else {
            ctrl.subtotal = ctrl.LegalizacionCompras.Valor + (ctrl.Impuesto.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor);
        }
        ctrl.Total = ctrl.subtotal - sum_impuestos;
    };
    ctrl.limpiar_compras = function() {
        $scope.encontrado = false;
        ctrl.LegalizacionCompras = null;
    };
    $scope.$watch('d', function() {
        if($scope.d){
          $interval( function() {
              ctrl.gridImpuestosApi.core.handleWindowResize();
            }, 500, 2);


        }
      });

    ctrl.cargar_proveedor = function() {
        $scope.encontrado = false;
        ctrl.LegalizacionCompras.InformacionProveedor = null;
        administrativaRequest.get("informacion_proveedor",
                $.param({
                    query: "NumDocumento:" + ctrl.LegalizacionCompras.Tercero,
                    limit: -1
                }))
            .then(function(response) {
                if (response.data == null) {
                    $scope.encontrado = "true";
                } else {
                    ctrl.LegalizacionCompras.InformacionProveedor = response.data[0];

                }
            });
    }
    $scope.$watch('legalizacionEvtCompra.concepto[0].Id', function(newValue,oldValue) {
                if (!angular.isUndefined(newValue)) {
                  $scope.movimientos = undefined;
                    financieraRequest.get('concepto', $.param({
                        query: "Id:" + newValue.Id,
                        fields: "Rubro",
                        limit: -1
                    })).then(function(response) {
                        $scope.legalizacionEvtCompra.concepto[0].Rubro = response.data[0].Rubro;
                    });
                }
            }, true);

            $scope.$watch('legalizacionEvtCompra.concepto[0].movimientos', function(newValue) {
              console.log("movimientos Contables 2" ,newValue);
            },true);
  });
