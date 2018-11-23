'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:movimientosContables
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires uiGridConstants
 * @requires $translate
 * @requires $scope
 * @param {boolean} validatemov variable que confirma si la transaccion es correcta o no
 * @param {object|array} movimientos movimientos realizados sobre cada cuenta contable
 * @param {undefined} editable bandera de cualquier tipo para conocer si se requiere que la directiva permita edición
 * @param {int} monto monto dado sobre el concepto
 * @param {string|int} conceptoid Id del concepto a registrar movimientos
 * @description
 * # movimientosContables
 * Directiva en la cual se realiza la gestion de los movimientos contables producidos en una transacción referente a un concepto
 */

angular.module('financieraClienteApp')
    .directive('movimientosContables', function(financieraRequest, uiGridConstants, $translate,$q,$interval) {
        return {
            restrict: 'E',
            scope: {
                conceptoid: '=?',
                movimientos: '=?',
                editable: '@?',
                impydesc: '@?',
                queryce:'=?',
                monto: '=?',
                outputvalorbruto: '=?',
                outputformapagoop: '=?',
                validatemov: '=?',
                ventanadespl:'=?',
                impuestos:'=?',
                tercero:'=?'
            },
            templateUrl: 'views/directives/cuentas_contables/movimientos_contables.html',
            link: function(scope, element, attrs) {
                scope.showmovs = 'conceptoid' in attrs;
                if ('editable' in attrs) {
                    attrs['editable'] = true;
                } else {
                    attrs['editable'] = false;
                }
                if ('queryce' in attrs) {
                    attrs['queryce'] = true;
                } else {
                    attrs['queryce'] = false;
                }
            },
            controller: function($scope, $attrs) {
                console.log("directiva scope queryce" + $scope.queryce);
                $scope.show_descs = 'impydesc' in $attrs;
                $scope.show_selcuent = 'selcuentas' in $attrs
                var self = this;
                self.btnselec=$translate.instant('BTN.SELECCIONAR');
                self.descuentos_nuevos = [];
                self.posactual = 0;
                self.cargarCuentas = true;
                self.impuestosTemp = [];
                financieraRequest.get('forma_pago',
                  $.param({
                    limit: 0
                })).then(function(response) {
                    self.formaPagos = response.data;
                  });
                //grid para movimientos generales
                self.gridOptionsMovimientos = {
                    showColumnFooter: true,
                    enableCellEditOnFocus: true,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    enableRowHeaderSelection: false,
                    enableFiltering: false,
                    enableSorting: true,
                    rowEditWaitInterval: -1,
                    columnDefs: [{
                            field: 'CuentaContable.Codigo',
                            displayName: $translate.instant('CODIGO') + " " + $translate.instant('CUENTA'),
                            cellClass: function(_, row) {
                                if (row.entity.TipoCuentaEspecial == undefined) {
                                    return 'texto_no_cuenta_especial';

                                } else {
                                    return 'texto_cuenta_especial';
                                }
                            },
                            headerCellClass: 'encabezado',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.NivelClasificacion.Nombre;
                            },
                            enableCellEdit: false,
                            width: '15%'
                        },
                        {
                            field: 'CuentaContable.Nombre',
                            displayName: $translate.instant('DESCRIPCION'),
                            cellClass: function(_, row) {
                                if (row.entity.TipoCuentaEspecial == undefined) {
                                    return 'texto_no_cuenta_especial';
                                } else {
                                    return 'texto_cuenta_especial';
                                }
                            },
                            cellTemplate: '<div ng-if="row.entity.TipoCuentaEspecial!=undefined"><strong>[{{row.entity.TipoCuentaEspecial.Nombre}} ' + $translate.instant('NO') + '{{row.entity.Id}}]</strong>. {{row.entity.CuentaContable.Nombre}} <div ng-if="row.entity.TipoCuentaEspecial.CuentaEspecialImpuesto == true">'+$translate.instant('VALOR_BASE_RETENCION') +':{{row.entity.ValorBase | currency }}</div> </div>' +
                                '<div ng-if="row.entity.TipoCuentaEspecial==undefined"> {{row.entity.CuentaContable.Nombre}} </div>',
                            headerCellClass: 'encabezado',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
                            },
                            enableCellEdit: false,
                            width: '40%'
                        },
                        {
                            field: 'Debito',
                            displayName: $translate.instant('DEBITO'),
                            cellClass: 'input_right',
                            headerCellClass: 'encabezado',
                            cellTemplate: '<div>{{row.entity.Debito | currency:undefined:0}}</div>',
                            width: '15%',
                            enableCellEdit: true,
                            cellEditableCondition: function($scope) {
                               var respuesta;
                                if ($scope.row.entity.TipoCuentaEspecial == undefined) {
                                    respuesta =  true;
                                } else {
                                    if ($scope.row.entity.TipoCuentaEspecial.Nombre === "Impuesto" || $scope.row.entity.TipoCuentaEspecial.Nombre === "Endoso") {
                                        respuesta =  false;
                                    } else {
                                        respuesta =  true;
                                    }
                                }

                                return respuesta;
                            },
                            type: 'number',
                            cellFilter: 'number',
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div> Total {{grid.appScope.d_movimientosContables.suma1 | currency}}</div>',
                            footerCellClass: 'input_right'
                        },
                        {
                            field: 'Credito',
                            displayName: $translate.instant('CREDITO'),
                            cellClass: 'input_right',
                            width: '15%',
                            headerCellClass: 'encabezado',
                            type: 'number',
                            cellFilter: 'number',
                            enableCellEdit: true,
                            cellEditableCondition: function($scope) {
                               var respuesta;
                                if ($scope.row.entity.TipoCuentaEspecial == undefined) {
                                    respuesta = true;
                                } else {
                                    if ($scope.row.entity.TipoCuentaEspecial.Nombre === "Impuesto" || $scope.row.entity.TipoCuentaEspecial.Nombre === "Endoso") {
                                      respuesta =  false;
                                    } else {
                                    respuesta =  true;
                                    }
                                }
                                return respuesta;
                            },
                            cellTemplate: '<div>{{row.entity.Credito | currency:undefined:0}}</div>',
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div> Total {{grid.appScope.d_movimientosContables.suma2 | currency}}</div>',
                            footerCellClass: 'input_right'
                        },
                        {
                            field: 'CuentaContable.Naturaleza',
                            displayName: $translate.instant('NATURALEZA'),
                            headerCellClass: 'encabezado',
                            cellClass: function(_, row) {
                                if (row.entity.TipoCuentaEspecial == undefined) {
                                    return 'texto_no_cuenta_especial';
                                } else {
                                    return 'texto_cuenta_especial';
                                }
                            },
                            enableCellEdit: false,
                            width: '15%'
                        }
                    ],
                    onRegisterApi:function(gridApi){
                      self.gridApiMovimientos = gridApi;
                    }
                };

                //grid para movimientos acreedores
                self.gridOptionsMovsAcreedores = {
                    showColumnFooter: true,
                    enableCellEditOnFocus: true,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    enableRowHeaderSelection: false,
                    enableFiltering: false,
                    enableSorting: true,
                    rowEditWaitInterval: -1,
                    headerTemplate: '<div class="ui-grid-top-panel ui-grid-cell-contents ui-grid-header-cell-primary-focus text-info" style="text-align: center">Cuentas Acreedoras</div>',
                    columnDefs: [{
                            field: 'CuentaContable.Codigo',
                            displayName: $translate.instant('CODIGO') + " " + $translate.instant('CUENTA'),
                            cellClass: 'text-info',
                            headerCellClass: 'text-warning',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.NivelClasificacion.Nombre;
                            },
                            enableCellEdit: false,
                            width: '15%'
                        },
                        {
                            field: 'CuentaContable.Nombre',
                            displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
                            cellClass: 'text-info',
                            headerCellClass: 'text-warning',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
                            },
                            enableCellEdit: false,
                            width: '40%'
                        },
                        {
                            field: 'Debito',
                            displayName: $translate.instant('DEBITO'),
                            headerCellClass: 'text-info',
                            cellTemplate: '<div ng-init="row.entity.Debito=0">{{row.entity.Debito | currency:undefined:0}}</div>',
                            width: '15%',
                            enableCellEdit: true,
                            cellEditableCondition: function() {
                                return $scope.editable;
                            },
                            type: 'number',
                            cellFilter: 'number',
                            aggregationType: uiGridConstants.aggregationTypes.sum
                        },
                        {
                            field: 'Credito',
                            displayName: $translate.instant('CREDITO'),
                            width: '15%',
                            headerCellClass: 'text-info',
                            type: 'number',
                            cellFilter: 'number',
                            enableCellEdit: true,
                            cellEditableCondition: function() {
                                return $scope.editable;
                            },
                            cellTemplate: '<div ng-init="row.entity.Credito=0">{{row.entity.Credito | currency:undefined:0}}</div>',
                            aggregationType: uiGridConstants.aggregationTypes.sum
                        },
                        {
                            field: 'CuentaContable.Naturaleza',
                            displayName: $translate.instant('NATURALEZA'),
                            headerCellClass: 'text-info',
                            cellClass: 'text-warning',
                            enableCellEdit: false,
                            width: '15%'
                        }
                    ]
                };

                self.gridOptionsDescuentos = {
                    showColumnFooter: true,
                    enableRowSelection: true,
                    multiSelect: false,
                    modifierKeysToMultiSelect: false,
                    enableCellEditOnFocus: true,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    enableRowHeaderSelection: false,
                    enableFiltering: false,
                    enableSorting: true,
                    rowEditWaitInterval: -1,
                    columnDefs: [{
                            field: 'CuentaContable.Codigo',
                            displayName: $translate.instant('CODIGO'),
                            cellClass: 'input_center',
                            headerCellClass: 'encabezado',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.NivelClasificacion.Nombre;
                            },
                            enableCellEdit: false,
                            width: '15%'
                        },
                        {
                            field: 'Descripcion',
                            displayName: $translate.instant('DESCRIPCION'),
                            cellClass: 'input_center',
                            headerCellClass: 'encabezado',
                            cellTooltip: function(row) {
                                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
                            },
                            cellTemplate: '<div><strong>[{{row.entity.TipoCuentaEspecial.Nombre}} ' + $translate.instant('NO') + '{{row.entity.Id}}]</strong>, {{row.entity.CuentaContable.Nombre}} <div ng-if="row.entity.TipoCuentaEspecial.CuentaEspecialImpuesto == true">'+$translate.instant('VALOR_BASE_RETENCION') +': {{row.entity.ValorBase | currency}}</div></div>',
                            enableCellEdit: false,
                            width: '30%'
                        },
                        {
                            field: 'Debito',
                            displayName: $translate.instant('DEBITO'),
                            cellClass: 'input_center',
                            headerCellClass: 'encabezado',
                            cellTemplate: '<div>{{row.entity.Debito | currency:undefined:0}}</div>',
                            width: '15%',
                            enableCellEdit: true,
                            cellEditableCondition: function($scope) {
                               var respuesta;
                                if ($scope.row.entity.TipoCuentaEspecial == undefined) {
                                    respuesta = true;

                                } else {
                                    if ($scope.row.entity.TipoCuentaEspecial.Nombre === "Impuesto" || $scope.row.entity.TipoCuentaEspecial.Nombre === "Endoso") {
                                        respuesta = false;

                                    } else {
                                        respuesta = true;

                                    }
                                }

                                return respuesta;
                            },
                            type: 'number',
                            cellFilter: 'number',
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
                            footerCellClass: 'input_right'
                        },
                        {
                            field: 'Credito',
                            displayName: $translate.instant('CREDITO'),
                            cellClass: 'input_right',
                            width: '15%',
                            headerCellClass: 'encabezado',
                            cellTemplate: '<div>{{row.entity.Credito | currency:undefined:0}}</div>',
                            type: 'number',
                            cellFilter: 'number',
                            enableCellEdit: true,
                            cellEditableCondition: function($scope) {
                                var respuesta;
                                if ($scope.row.entity.TipoCuentaEspecial == undefined) {
                                    respuesta = true;

                                } else {
                                    if ($scope.row.entity.TipoCuentaEspecial.Nombre === "Impuesto" || $scope.row.entity.TipoCuentaEspecial.Nombre === "Endoso") {
                                        respuesta = false;

                                    } else {
                                        respuesta = true;

                                    }
                                }
                                return respuesta;
                            },
                            aggregationType: uiGridConstants.aggregationTypes.sum,
                            footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
                            footerCellClass: 'input_right'
                        },
                        {
                            field: 'CuentaContable.Naturaleza',
                            displayName: $translate.instant('NATURALEZA'),
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                            enableCellEdit: false,
                            width: '15%'
                        },
                        {
                            name: $translate.instant('OPCIONES'),
                            //enableFiltering: false,
                            width: '10%',
                            enableCellEdit: false,
                            headerCellClass: 'encabezado',
                            cellClass: 'input_center',
                            cellTemplate: '<center>' +
                                '<a ng-if="row.entity.TipoCuentaEspecial.Nombre == grid.appScope.d_movimientosContables.Endosar" href="" class="endosar" ng-click="grid.appScope.d_movimientosContables.actualizar_posicion(row.entity)" data-toggle="modal" data-target="#modalEndosar" >' +
                                '<i class="fa fa-gear fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.ENDOSAR\' | translate }}"></i></a> ' +
                                '<a ng-if="row.entity.TipoCuentaEspecial.CuentaEspecialImpuesto == true" ng-click="grid.appScope.d_movimientosContables.actualizar_posicion(row.entity)" href="" class="addvalorbase" data-toggle="modal" data-target="#modalAddValorBase">' +
                                '<i class="fa fa-gear fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.ADD_VALOR_BASE\' | translate }}"></i></a>' +
                                '<a href="" class="borrar" data-toggle="modal" data-target="#modalverplan" ng-click="grid.appScope.d_movimientosContables.quitar_descuento(row.entity)">' +
                                '<i class="fa fa-trash fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.BORRAR\' | translate }}"></i></a> ' +
                                '</center>'
                        }
                    ]
                };

                self.quitar_descuento = function(item) {
                    if (item != undefined) {
                        //console.log(item);
                        var i = self.gridOptionsDescuentos.data.indexOf(item);
                        var j = $scope.movimientos.indexOf(item);
                        //console.log(i, j);
                        if (i >= 0 && j >= 0) {
                            self.gridOptionsDescuentos.data.splice(i, 1);
                            $scope.movimientos.splice(j, 1);
                            self.cargar_cuentas_grid();
                        }
                    }
                };


                self.agregar_descuento = function(item) {
                    if (item != undefined) {
                        item.Concepto = self.concepto_movs;
                        if (item.TipoCuentaEspecial.Nombre === "Impuesto") {
                            //item.Credito = Math.round(item.Porcentaje * $scope.monto);
                        }
                        if (item.TipoCuentaEspecial.Nombre === "Endoso") {
                            self.Endosar ="Endoso";
                            self.ValorMaximo = self.calcular_descuento(item,$scope.outputvalorbruto);
                        } else {
                            if ($scope.outputformapagoop != undefined)
                            {
                             item.FormaPago = $scope.outputformapagoop;
                            }
                            if (item.TipoCuentaEspecial.Nombre !== "Descuento") {
                                self.itemImpuesto = item;
                                item.TipoCuentaEspecial.CuentaEspecialImpuesto = true;
                            }
                        }
                        item.CuentaEspecial = { Id: item.Id };
                        if (self.gridOptionsDescuentos.data.indexOf(item) < 0) {
                            self.gridOptionsDescuentos.data.unshift(item);
                            $scope.movimientos.unshift(item);
                            self.cargar_cuentas_grid();
                        }
                    }
                };

                self.agregar_cuenta= function(item,showSwal) {
                  var movimiento={};
                  if(!angular.isUndefined(item)){
                    self.padre = null;
                    delete item.Hijos;
                    if (!angular.isUndefined(item.CuentaContable)){
                      movimiento.CuentaContable = item.CuentaContable;
                    }else{
                      movimiento.CuentaContable = item;
                    }
                    if(!angular.isUndefined(item.CuentaEspecial)){
                      movimiento.CuentaEspecial = item.CuentaEspecial;
                    }
                    movimiento.Concepto = self.concepto_movs;
                    movimiento.Debito=0;
                    movimiento.Credito=0;
                    var findedElement =  $scope.movimientos.find(function(element){
                      return element.CuentaContable.Id === movimiento.CuentaContable.Id;
                    });
                    if(angular.isUndefined(findedElement)){
                      $scope.movimientos.push(movimiento);
                      self.cargar_cuentas_grid();
                    }
                    if(showSwal===true){
                      swal({
                          title: '',
                          text: $translate.instant('AGREGAR_MAS_CUENTAS'),
                          type: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: $translate.instant('BTN.ACEPTAR'),
                          cancelButtonText: $translate.instant('BTN.CANCELAR')
                      }).then(function(result) {}, function(dismiss) {
                            $('#modalSeleccionCuentas').modal('hide');
                          });
                    }
                  }
                }

                self.asignar_endoso = function(item){
                    var pos = self.gridOptionsDescuentos.data.indexOf(item);
                    self.gridOptionsDescuentos.data[pos].Credito = item.ValorInicialEndoso;
                }
                self.validar_endoso = function (item) {
                    if (item != undefined) {
                        return (item.ValorInicialEndoso > 0) && (item.ValorInicialEndoso <= self.ValorMaximo) ;
                    }
                    else {
                        return false;
                    }
                }
                self.validar_valor_base = function(item){
                    if (item != undefined) {
                        return item.ValorBase != undefined ;
                    }
                    else {
                        return false;
                    }
                }
                self.calcular_descuento= function (item, valor){
                    return Math.round(item.Porcentaje * valor) ;
                }
                self.asignar_valor_base = function(item){
                    var pos = self.gridOptionsDescuentos.data.indexOf(item);
                    if (self.gridOptionsDescuentos.data[pos].ValorBase != undefined) {
                        self.gridOptionsDescuentos.data[pos].Credito = self.calcular_descuento(item,self.gridOptionsDescuentos.data[pos].ValorBase);
                    }

                }
                self.actualizar_posicion = function(item){
                    if (item.TipoCuentaEspecial.Nombre === "Endoso") {
                        self.ValorMaximo = self.calcular_descuento(item,$scope.outputvalorbruto);
                    }
                    self.posactual = self.gridOptionsDescuentos.data.indexOf(item);
                }

                /*self.agregar_desc_mov=function(){
                    for (var i = 0; i < self.gridOptionsDescuentos.data.length; i++) {
                      if ($scope.movimientos.indexOf(self.gridOptionsDescuentos.data[i]) < 0) {
                        $scope.movimientos.unshift(self.gridOptionsDescuentos.data[i]);
                        self.cargar_cuentas_grid();
                      }
                    }
                };*/

                self.cargar_concepto = function() {
                    if ($scope.conceptoid != undefined) {
                        self.getConcepto = financieraRequest.get('concepto', $.param({
                            query: 'Id:' + $scope.conceptoid
                        })).then(function(response) {
                            self.concepto_movs = response.data[0];
                        });
                    }
                };

                self.cargar_cuentas_concepto = function() {
                    if ($scope.conceptoid != undefined && angular.isUndefined($scope.movimientos)) {
                      self.servicioPromesa =  financieraRequest.get('concepto_cuenta_contable', $.param({
                            query: "Concepto:" + $scope.conceptoid,
                            limit: 0
                        })).then(function(response) {
                            $scope.movimientos = response.data;
                        });
                    }
                    $q.all([self.servicioPromesa]).then(function() {
                        self.cargar_cuentas_grid();
                    });

                };


                /**
                 * @ngdoc function
                 * @name financieraClienteApp.directive:movimientosContables#cargar_cuentas
                 * @methodOf financieraClienteApp.directive:movimientosContables
                 * @description En base al conceptoid dado por el scope de la directiva se consume el servicio
                 * {@link financieraService.service:financieraRequest financieraRequest}  para obtener las cuentas contables asociadas al concepto
                 * y con estas manejar los movimientos que se vallan a realizar
                 */
                self.cargar_cuentas_grid = function() {
                    if ($scope.movimientos != null) {
                        self.gridOptionsMovimientos.data = [];
                        self.gridOptionsMovsAcreedores.data = [];
                        for (var i = 0; i < $scope.movimientos.length; i++) {
                            if ($scope.movimientos[i].Debito == null) {
                                $scope.movimientos[i].Debito = 0;
                            }
                            if ($scope.movimientos[i].Credito == null) {
                                $scope.movimientos[i].Credito = 0;
                            }
                            if (!$scope.movimientos[i].CuentaAcreedora) {
                                self.gridOptionsMovimientos.data.push($scope.movimientos[i]);
                            } else {
                                self.gridOptionsMovsAcreedores.data.push($scope.movimientos[i]);
                            }
                        }
                    }
                    /*else {
                                   $scope.movimientos = [];
                                   self.gridOptionsMovimientos.data = $scope.movimientos;
                                   $scope.gridHeight = self.gridOptionsMovimientos.rowHeight * 2;
                                   $scope.grid2Height = self.gridOptionsMovsAcreedores.rowHeight * 2;
                                 } */
                };


                /**
                 * @ngdoc event
                 * @name financieraClienteApp.directive:movimientosContables#watch_on_grids_data
                 * @eventOf financieraClienteApp.directive:movimientosContables
                 * @param {array} gridOptionsMovimientos variable que activa el evento
                 * @param {array} gridOptionsMovsAcreedores variable que activa el evento
                 * @description Si el data de alguno de los grids surge un cambio Se activa el evento que se encarga de realizar la validacion
                 * por medio de la suma de los valores del principio de partida doble, y muestra un mensaje dependiendo si este se cumple o no con el cambio generado.
                 */
                $scope.$watch('[d_movimientosContables.gridOptionsMovimientos.data,monto,d_movimientosContables.gridOptionsMovsAcreedores.data]', function() {
                    if ($scope.monto == undefined) {
                        $scope.monto = 0;
                    }
                    self.suma1 = 0;
                    self.suma2 = 0;
                    self.suma3 = 0;
                    self.suma4 = 0;
                    if (self.gridOptionsMovimientos.data.length != undefined) {
                    for (var i = 0; i < self.gridOptionsMovimientos.data.length; i++) {
                        if (self.gridOptionsMovimientos.data[i].TipoCuentaEspecial != undefined) {
                            if (self.gridOptionsMovimientos.data[i].TipoCuentaEspecial.Nombre !== "Descuento" && self.gridOptionsMovimientos.data[i].TipoCuentaEspecial.Nombre !== "Endoso") {
                                 self.gridOptionsMovimientos.data[i].Credito = Math.round(self.gridOptionsMovimientos.data[i].ValorBase * self.gridOptionsMovimientos.data[i].Porcentaje);
                            }
                        }
                        self.suma1 = self.suma1 + self.gridOptionsMovimientos.data[i].Debito;
                        self.suma2 = self.suma2 + self.gridOptionsMovimientos.data[i].Credito;
                    }
                    }
                    if (!angular.isUndefined(self.gridOptionsMovsAcreedores.data) && self.gridOptionsMovsAcreedores.data.length > 0) {
                        for (var j = 0; j < self.gridOptionsMovsAcreedores.data.length; j++) {
                            self.suma3 = self.suma3 + self.gridOptionsMovsAcreedores.data[j].Debito;
                            self.suma4 = self.suma4 + self.gridOptionsMovsAcreedores.data[j].Credito;
                        }
                    } else {
                        self.suma3 = self.suma1;
                        self.suma4 = self.suma3;
                    }
                    if (self.suma1 == self.suma2 && self.suma3 == self.suma4 && self.suma1 == self.suma4) {
                        if ($scope.monto != self.suma1) {
                            $scope.validatemov = false;
                        } else {
                            $scope.validatemov = true;
                        }
                    } else {
                        $scope.validatemov = false;
                    }
                }, true);

                self.cargar_plan_maestro = function() {
                  if (self.cargarCuentas) {
                    financieraRequest.get("plan_cuentas", $.param({
                      query: "PlanMaestro:" + true
                    })).then(function(response) {
                      self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
                    });
                    self.cargarCuentas=false;
                  }

                };

                /**
                 * @ngdoc event
                 * @name financieraClienteApp.directive:movimientosContables#watch_on_conceptoid
                 * @eventOf financieraClienteApp.directive:movimientosContables
                 * @param {string|int} conceptoid variable que activa el evento
                 * @description Si la variable conceptoid cambia el evento se activa recargando las cuentas contables
                 */
                $scope.$watch('conceptoid', function(newValue) {
                    if (!angular.isUndefined(newValue)) {
                        self.cargar_concepto();
                        self.cargar_cuentas_concepto();
                    }

                }, true);

                $scope.$watch('impuestos', function(newValue,oldValue) {
                    if(!angular.isUndefined(self.servicioPromesa)&&!angular.isUndefined(self.getConcepto)&&!angular.isUndefined(newValue)){
                      $q.all([self.servicioPromesa,self.getConcepto]).then(function() {
                        if(newValue.length<oldValue.length){
                          var idsA = newValue.map( function(x){ return x.CuentaContable.Id; }).sort();
                          var idsB = oldValue.map( function(x){ return x.CuentaContable.Id; }).sort();
                          if (idsA.length > 0)  {
                            angular.forEach(idsB,function(item){
                              if(!idsA.includes(item)) {
                                 $scope.movimientos = $scope.movimientos.filter(function(valMov){
                                  return (valMov.CuentaContable.Id != item);
                                });
                               }
                              });
                          }else{
                            $scope.movimientos = $scope.movimientos.filter(function(valMov){
                            var retorno
                             if (valMov.CuentaContable.Id === idsB[0]){
                               retorno = false;
                             }else{
                               retorno = true;
                             }
                             return retorno
                           });
                          }
                          self.cargar_cuentas_grid();
                        }else{
                          angular.forEach(newValue,function(item){
                            console.log(item)
                            item.CuentaEspecial = {Id:item.Id}
                            self.agregar_cuenta(item);
                          });
                        }

                        });
                    }
                }, true);
                /**
                 * @ngdoc event
                 * @name financieraClienteApp.directive:movimientosContables#watch_on_outputvalorbruto
                 * @eventOf financieraClienteApp.directive:movimientosContables
                 * @param {string|int} outputvalorbruto variable que activa el evento
                 * @description Si la variable outputvalorbruto cambia el evento se activa guardando variable en directiva
                 */
                $scope.$watch('outputvalorbruto', function() {
                    if (!angular.isUndefined($scope.outputvalorbruto) && !angular.isUndefined($scope.cuen) && $scope.outputvalorbruto > 0) {
                        self.valorMaximo = self.calcular_descuento($scope.cuen,$scope.outputvalorbruto);
                    }
                });

                $scope.$watch('ventanadespl', function(newValue) {
                  if(newValue){
                    $interval( function() {
                        self.gridApiMovimientos.core.handleWindowResize();
                      }, 500, 2);
                  }
                },true);
            },
            controllerAs: 'd_movimientosContables'
        };
    });
