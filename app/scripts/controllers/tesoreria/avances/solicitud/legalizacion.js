'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesLegalizacionCtrl
 * @description
 * # TesoreriaAvancesLegalizacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('LegalizacionCtrl', function($scope, agoraRequest,financieraRequest, administrativaRequest,$window, $translate, $localStorage,$q, wso2Request,$interval,$location,uiGridConstants,financieraMidRequest,gridApiService) {
        var ctrl = this;
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.concepto=[];
        $scope.encontrado = false;
        $scope.solicitud = $localStorage.avance;
        ctrl.Vigencia=2018;
        ctrl.UnidadEjecutora=1;
        ctrl.movContablesEnc = false;
        ctrl.notLoadConcepto = false;
        $scope.botones = [
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true },
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'look', estado: true }
        ];

        $scope.clase_load = {
            clase: "fa fa-spinner",
            animacion: "faa-spin animated"
        };

        ctrl.legalizacionCompras = { Valor: 0 };
        ctrl.subtotal = 0;
        ctrl.gridOptionsCompras = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'InformacionProveedor.NumDocumento',
                    displayName: $translate.instant('DOCUMENTO') + " " + $translate.instant('TERCERO'),
                    width: '12%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'NumeroFactura',
                    displayName: $translate.instant('NO_FACTURA'),
                    width: '12%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'InformacionProveedor.NomProveedor',
                    displayName: $translate.instant('NOMBRE'),
                    width: '39%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Valor',
                    displayName: $translate.instant('VALOR'),
                    cellClass: 'input_right',
                    cellFilter: 'currency',
                    width: '14%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'FechaCompra',
                    displayName: $translate.instant('FECHA_COMPRA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaCompra | date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '10%',
                    headerCellClass: 'encabezado'
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrowcompras(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ],
            onRegisterApi: function(gridApi){
              ctrl.gridComprasApi=gridApi;
            }
        };

        ctrl.gridOptionsPracticas = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'Tercero',
                    displayName: $translate.instant('CODIGO'),
                    width: '12%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Estudiante.numero_documento',
                    displayName: $translate.instant('DOCUMENTO'),
                    width: '12%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Estudiante.nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '39%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Valor',
                    displayName: $translate.instant('VALOR'),
                    cellClass: 'input_right',
                    cellFilter: 'currency',
                    width: '14%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Dias',
                    displayName: $translate.instant('Dias'),
                    width: '14%',
                    headerCellClass: 'encabezado'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '10%',
                    headerCellClass: 'encabezado',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrowpracticas(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ],
            onRegisterApi: function(gridApi){
              ctrl.gridPracticasApi=gridApi;
            }
        };

        ctrl.gridReintegros = {
                  enableRowSelection: true,
                  enableSelectAll: false,
                  selectionRowHeaderWidth: 35,
                  multiSelect: false,
                  enableRowHeaderSelection: false,
                  paginationPageSizes: [5, 10, 15],
                  paginationPageSize: 10,
                  enableFiltering: true,
                  minRowsToShow: 10,
                  useExternalPagination: false,
                  columnDefs:[{
                      field: 'Reintegro.Id',
                      visible: false
                    },
                    {
                      field: 'Reintegro.Consecutivo',
                      displayName: $translate.instant('CONSECUTIVO'),
                      width: '25%',
                      headerCellClass: 'encabezado'
                    },
                    {
                      field: 'Reintegro.Causal.Descripcion',
                      width: '50%',
                      displayName: $translate.instant('CAUSAL_REINTEGRO'),
                      cellClass: 'input_center',
                      headerCellClass: 'encabezado'
                    },
                    {
                      field: 'Reintegro.Ingreso.IngresoConcepto.ValorAgregado',
                      displayName: $translate.instant('VALOR'),
                      cellClass: 'input_right',
                      width: '25%',
                      cellFilter: 'currency',
                      headerCellClass: 'encabezado'
                    }
                  ],
                  onRegisterApi: function(gridApi) {
                    ctrl.gridReintApi = gridApi;
                  }
                };

        $scope.loadrowpracticas = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "add":
                    $location.path('/tesoreria/avances/solicitud/legalizacion_practica_academica');
                    break;
                case "edit":
                  $localStorage.legalizacion = row.entity;
                  $window.open('#/tesoreria/avances/solicitud/ev_legalizacion_tipo/'+row.entity.TipoAvanceLegalizacion.NumeroOrden+'/'+false, '_blank', 'location=yes');
                  break;
                case "delete":
                    ctrl.delete_requisito();
                    break;
                case "look":
                  $localStorage.legalizacion = row.entity;
                  $window.open('#/tesoreria/avances/solicitud/ev_legalizacion_tipo/'+row.entity.TipoAvanceLegalizacion.NumeroOrden+'/'+true, '_blank', 'location=yes');
                  break;
            }
        };

        $scope.loadrowcompras = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "add":
                    $location.path('/tesoreria/avances/solicitud/legalizacion_evento_compra');
                    break;
                case "edit":
                    $localStorage.legalizacion = row.entity;
                    $window.open('#/tesoreria/avances/solicitud/ev_legalizacion_tipo/'+row.entity.TipoAvanceLegalizacion.NumeroOrden+'/'+false, '_blank', 'location=yes');
                    break;
                case "delete":
                    ctrl.delete_compra();
                    break;
                case 'look':
                    $localStorage.legalizacion = row.entity;
                    $window.open('#/tesoreria/avances/solicitud/ev_legalizacion_tipo/'+row.entity.TipoAvanceLegalizacion.NumeroOrden+'/'+true, '_blank', 'location=yes');
                    break;
            }
        };

        ctrl.agregarReintegro = function(){
          $('#modal_add_reintegro').modal('show');
          $scope.g = false;
        }

        ctrl.delete_compra = function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.Id,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {
              ctrl.row_entity.EstadoAvanceLegalizacionTipo = {Id:2};
                financieraRequest.put('avance_legalizacion_tipo',ctrl.row_entity.Id,ctrl.row_entity)
                .then(function(response){
                  if (response.status === 200) {
                      swal(
                          $translate.instant('ELIMINADO'),
                          ctrl.row_entity.Id + ' ' + $translate.instant('FUE_ELIMINADO'),
                          'success'
                      );
                      ctrl.get_all_avance_legalizacion_compra();
                  }
                });
            })
        };

        ctrl.cargarReintegros=function(){
          financieraRequest.get("reintegro_avance_legalizacion",
                  $.param({
                      query: "AvanceLegalizacion.Id:"+$scope.solicitud.avanceLegalizacion.Id, //Impuesto RETE IVA
                      limit: -1
                  }))
              .then(function(response) {
                if(typeof(response.data)!="string" && response.data != null){
                  angular.forEach(response.data,function(row){
                    financieraRequest.get("ingreso_concepto",
                            $.param({
                                query: "Ingreso.Id:"+row.Reintegro.Ingreso.Id,
                                limit: 1
                            }))
                        .then(function(response) {
                          row.Reintegro.Ingreso.IngresoConcepto = response.data[0]
                        });
                  });
                    ctrl.gridReintegros.data = response.data;
                }else{
                    ctrl.gridReintegros.data = [];
                }

              });
        }
        ctrl.delete_requisito = function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.Id,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {
              ctrl.row_entity.EstadoAvanceLegalizacionTipo = {Id:2};
              financieraRequest.put('avance_legalizacion_tipo',ctrl.row_entity.Id,ctrl.row_entity)
              .then(function(response){
                if (response.status === 200) {
                    swal(
                        $translate.instant('ELIMINADO'),
                        ctrl.row_entity.Id + ' ' + $translate.instant('FUE_ELIMINADO'),
                        'success'
                    );
                    ctrl.get_all_avance_legalizacion_practica();
                }
              });
            })
        };

        ctrl.get_all_avance_legalizacion_practica = function() {
            financieraMidRequest.get("legalizacion_avance/GetAllLegalizacionTipo", $.param({
                    query: "AvanceLegalizacion.Id:" + $scope.solicitud.avanceLegalizacion.Id + ",TipoAvanceLegalizacion.Id:1,EstadoAvanceLegalizacionTipo.NumeroOrden:1",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                  if (response.data != null){
                      ctrl.gridOptionsPracticas.data = response.data;
                  }else{
                    ctrl.gridOptionsPracticas.data = [];
                  }
                });
        };

        ctrl.get_all_avance_legalizacion_compra = function() {
            financieraMidRequest.get("legalizacion_avance/GetAllLegalizacionTipo", $.param({
                    query: "AvanceLegalizacion.Id:" + $scope.solicitud.avanceLegalizacion.Id + ",TipoAvanceLegalizacion.Id:2,EstadoAvanceLegalizacionTipo.NumeroOrden:1",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                  if (response.data!=null){
                    ctrl.gridOptionsCompras.data = response.data;
                    ctrl.LegalizacionCompras = response.data;
                  }else{
                      ctrl.gridOptionsCompras.data = [];
                    }

                });
        };
        ctrl.cargarLegalizaciones = function(){
          financieraMidRequest.get('legalizacion_avance/GetLegalizacionInformation/'+$scope.solicitud.Id,null).then(
            function(response){
              if(response.data != null && !angular.isUndefined(response.data.avanceLegalizacion)){
                $scope.solicitud.avanceLegalizacion = response.data.avanceLegalizacion[0];
                $scope.solicitud.valorLegalizado = response.data.Total;
                ctrl.get_all_avance_legalizacion_practica();
                ctrl.get_all_avance_legalizacion_compra();
                ctrl.cargarReintegros();
              }
            }
          );
        }
        ctrl.cargarLegalizaciones();
        ctrl.add_edit_compras = function() {
            var lista_impuestos = [];
            for (var i in ctrl.Impuesto) {
                if (ctrl.Impuesto[i].Valor !== 0) {
                    lista_impuestos.push({ CuentaEspecial: ctrl.Impuesto[i] });
                }
            }
            ctrl.LegalizacionCompras.TipoAvanceLegalizacion = { Id: 2 };
            ctrl.LegalizacionCompras.Avance = { Id: $scope.solicitud.Id };
            ctrl.LegalizacionCompras.Valor = parseFloat(ctrl.LegalizacionCompras.Valor);
            if (!angular.isUndefined(ctrl.LegalizacionCompras.TrmFechaCompra)) {
                ctrl.LegalizacionCompras.TrmFechaCompra = parseFloat(ctrl.LegalizacionCompras.TrmFechaCompra);
            }
            ctrl.LegalizacionCompras.AvanceLegalizacionCuentaEspecial = lista_impuestos;
            switch (ctrl.operacion) {
                case 'edit':
                    //$('#modal_legalizacion_compras').modal('hide');
                    break;
                case 'add':
                    financieraRequest.post("avance_legalizacion/AddAvanceLegalizacionCompra", ctrl.LegalizacionCompras)
                        .then(function(info) {
                            ctrl.get_all_avance_legalizacion_compra();
                        });
                    break;
                default:
            }
            ctrl.row_entity = {};
            $("#myModal").modal('hide');
        };


        ctrl.add_edit_practicas = function() {
            ctrl.LegalizacionPracticaAcademica.TipoAvanceLegalizacion = { Id: 1 };
            ctrl.LegalizacionPracticaAcademica.Avance = { Id: $scope.solicitud.Id };
            ctrl.LegalizacionPracticaAcademica.Valor = parseFloat(ctrl.LegalizacionPracticaAcademica.Valor);
            ctrl.LegalizacionPracticaAcademica.Dias = parseInt(ctrl.LegalizacionPracticaAcademica.Dias);
            switch (ctrl.operacion) {
                case 'edit':
                    financieraRequest.put("avance_legalizacion", ctrl.LegalizacionPracticaAcademica.Id, ctrl.LegalizacionPracticaAcademica)
                        .then(function(info) {
                            ctrl.get_all_avance_legalizacion_practica();
                        });
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                case 'add':
                    financieraRequest.post("avance_legalizacion", ctrl.LegalizacionPracticaAcademica)
                        .then(function(info) {
                            ctrl.get_all_avance_legalizacion_practica();
                        });
                    $('#modal_practicas_academicas').modal('hide');
                    break;
                default:
            }
            ctrl.row_entity = {};
        };
        $scope.$watch('legalizacion.concepto[0]', function(newValue,oldValue) {
                    if (!angular.isUndefined(newValue)) {
                        financieraRequest.get('concepto', $.param({
                            query: "Id:" + newValue.Id,
                            fields: "Rubro",
                            limit: -1
                        })).then(function(response) {
                            $scope.legalizacion.concepto[0].Rubro = response.data[0].Rubro;
                        });
                    }
                }, true);

      ctrl.addAccountingInf = function(){
        if (!ctrl.movValidado){
          swal("",$translate.instant('PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA'),"warning");
          return
        }
        var request;
        request = {
          ConceptoAvance:{
                          Avance:{Id:$scope.solicitud.Id},
                          Concepto:ctrl.concepto[0]
          }
        }
        angular.forEach(ctrl.movs, function(data) {
            delete data.Id;
        });
        request.Movimientos=ctrl.movs;
        financieraRequest.post('concepto_avance_legalizacion/CreateLegalizacionAccountantInfo',request).then(function(response) {
              swal('',$translate.instant(response.data.Code),response.data.Type);
        });
      }

        $scope.$watch('d', function() {
          if($scope.d){
            $interval( function() {
                ctrl.gridComprasApi.core.handleWindowResize();
              }, 500, 2);
          }
        });

        $scope.$watch('e', function() {
          if($scope.e){
            $interval( function() {
                ctrl.gridPracticasApi.core.handleWindowResize();
              }, 500, 2);
          }
        });

        $scope.$watch('g', function() {
          if($scope.g){
            $interval( function() {
                ctrl.gridReintApi.core.handleWindowResize();
              }, 500, 2);
          }
        });

        $scope.$watch('legalizacion.registraReintegro', function() {
          console.log(ctrl.registraReintegro);
          if(!angular.isUndefined(ctrl.registraReintegro) && ctrl.registraReintegro){
              ctrl.cargarReintegros();
              ctrl.registraReintegro = false;
          }
        });
    });
