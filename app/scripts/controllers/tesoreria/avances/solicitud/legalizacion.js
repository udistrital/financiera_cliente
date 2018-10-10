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
        ctrl.row_entity = {};
        ctrl.rubrosAfectados=[];
        ctrl.ordenesPago=[];
        ctrl.concepto=[];
        $scope.encontrado = false;
        $scope.solicitud = $localStorage.avance;
        ctrl.Vigencia=2018;
        ctrl.UnidadEjecutora=1;
        ctrl.movContablesEnc = false;
        ctrl.notLoadConcepto = false;
        $scope.solicitud.valorLegalizado = 0;
        $scope.botones = [
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true },
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'look', estado: true }
        ];

        $scope.botonesOp = [
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'deleteOP', estado: true }
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
                    field: 'Tercero',
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
                    field: 'InformacionProveedor[0].NomProveedor',
                    displayName: $translate.instant('NOMBRE'),
                    width: '39%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Valor',
                    displayName: $translate.instant('VALOR'),
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

        ctrl.gridOrdenesDePago = {
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
              field: 'Id',
              visible: false
            },
            {
              field: 'OrdenPago.Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '8%',
              displayName: $translate.instant('TIPO'),
              filter: {
                //term: 'OP-PROV',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.tipos
              },
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago.OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'OrdenPago.ValorBase',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('VALOR')
            },
            {
              field: 'OrdenPago.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO'),
              filter: {
                //term: 'Elaborado',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.estado_select

              },
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              name: $translate.instant('OPERACION'),
              enableFiltering: false,
              width: '5%',
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',

            }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridOPApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              ctrl.addOrdenPago(row.entity.Id);
            });
          }
        };

        ctrl.gridOrdenesDePagoAvance = {
          enableRowSelection: true,
          enableSelectAll: false,
          selectionRowHeaderWidth: 35,
          multiSelect: false,
          enableRowHeaderSelection: false,
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 10,

          enableFiltering: true,
          minRowsToShow: 10,
          useExternalPagination: true,

          columnDefs:[{
              field: 'Id',
              visible: false
            },
            {
              field: 'OrdenPago.Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '12%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '12%',
              displayName: $translate.instant('TIPO'),
              filter: {
                //term: 'OP-PROV',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.tipos
              },
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '12%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.OrdenPagoEstadoOrdenPago.OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '13%',
            },
            {
              field: 'OrdenPago.FormaPago.CodigoAbreviacion',
              width: '13%',
              displayName: $translate.instant('FORMA_PAGO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPago.ValorBase',
              width: '13%',
              cellFilter: 'currency',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('VALOR')
            },
            {
              field: 'OrdenPago.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '13%',
              displayName: $translate.instant('ESTADO'),
              filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.estado_select

              },
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              name: $translate.instant('OPERACION'),
              enableFiltering: false,
              width: '12%',
              headerCellClass: 'encabezado',
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrowOPAvance(fila,operacion)" grupobotones="grid.appScope.botonesOp" fila="row"></btn-registro></center>',
            }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridOPApiAvance = gridApi;
            gridApi = gridApiService.pagination(gridApi,ctrl.cargarOrdenesPagoAvance,$scope);
          }
        };

        ctrl.addOrdenPago = function(id){
          var ordenPagoAvance;
          ordenPagoAvance = {
            OrdenPago:{Id:id},
            Avance:{Id:$scope.solicitud.Id}
          };
          if (ctrl.ordenesPago.indexOf(ordenPagoAvance)===-1){
              ctrl.ordenesPago.push(ordenPagoAvance);
          }

        }
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
                      width: '25%',
                      cellFilter: 'currency',
                      headerCellClass: 'encabezado'
                    }
                  ],
                  onRegisterApi: function(gridApi) {
                    ctrl.gridReintApi = gridApi;
                  }
                };

        $scope.addRubro = function(idOp){
          var agregado = false;
          financieraRequest.get('concepto_orden_pago', $.param({
            query:"OrdenDePago.Id:"+idOp,
            limit:1
          })
        ).then(function(response) {
          var afectacionPresupuestal;
          afectacionPresupuestal = {rubro : response.data[0].Concepto.Rubro,
                                    valorAfectacion: response.data[0].Valor,
                                    ordenPago:[idOp]};
           angular.forEach(ctrl.rubrosAfectados,function(afectacionItem){
             if(!agregado){
               if (angular.equals(afectacionItem.rubro.Id,afectacionPresupuestal.rubro.Id)){
                 afectacionItem.valorAfectacion = afectacionItem.valorAfectacion + afectacionPresupuestal.valorAfectacion;
                 afectacionItem.ordenPago.push(idOp);
                 agregado = true;
               }
             }
           });
           if(!agregado){
              ctrl.rubrosAfectados.push(afectacionPresupuestal);
           }
        });
        }

        ctrl.removeRubro=function(rubro){
          var idx = ctrl.rubrosAfectados.indexOf(rubro);
          ctrl.rubrosAfectados.splice(idx,1);
        }

        ctrl.cargarOrdenesPagoAvance = function(offset,query){
          var querybase = "Avance.Id:"+$scope.solicitud.Id;
          if(angular.isUndefined(query)||query.trim().length===0){
            query = querybase;
          }else{
            query = query+","+querybase;
          }
          financieraRequest.get('orden_pago_avance_legalizacion', $.param({
            query:query,
            limit:ctrl.gridOrdenesDePagoAvance.paginationPageSize,
            offset:offset
          })
          ).then(function(response) {
            if(response.data === null){
              ctrl.hayData = false;
              ctrl.cargando = false;
              ctrl.gridOrdenesDePagoAvance.data = [];
            }else{

              ctrl.hayData = true;
              ctrl.cargando = false;


              if (typeof(response.data)!=="string") {
                ctrl.gridOrdenesDePagoAvance.data = response.data;
                angular.forEach(ctrl.gridOrdenesDePagoAvance.data,function(row){
                    $scope.addRubro(row.Id);
                });
              }

          }
          });
      }
      ctrl.cargarOrdenesPagoAvance(0,'');

        ctrl.cargarOrdenesPago = function(idCRP){
          financieraRequest.get('orden_pago_registro_presupuestal', $.param({
            query:"RegistroPresupuestal.Id:"+idCRP,
            limit:-1
          })
          ).then(function(response) {
            if(response.data === null){
              ctrl.hayData = false;
              ctrl.cargando = false;
              ctrl.gridOrdenesDePago.data = [];
            }else{

              ctrl.hayData = true;
              ctrl.cargando = false;

              ctrl.gridOrdenesDePago.data = response.data;

              angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {

                if(iterador.RegistroPresupuestal !== undefined){
                  agoraRequest.get('informacion_proveedor',
                  $.param({
                    query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
                  })
                ).then(function(response) {
                  if(response.data !== null){
                    iterador.Proveedor = response.data[0];
                  }

                });
              }
            });
          }
          });
      }
        $scope.loadrow = function(row, operacion) {
          self.operacion = operacion;
          switch (operacion) {
              case "ver":
                ctrl.op_detalle(row);
              break;
              default:
              break;
          }
      };

      ctrl.op_detalle = function(row) {
        var path = "/orden_pago/proveedor/ver/";
        $location.url(path + row.entity.Id);
      }

        $scope.loadrowpracticas = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "add":
                    $location.path('/tesoreria/avances/solicitud/legalizacion_practica_academica');
                    break;
                case "edit":
                    ctrl.LegalizacionPracticaAcademica = ctrl.row_entity;
                    $('#modal_practicas_academicas').modal('show');
                    break;
                case "delete":
                    ctrl.delete_requisito();
                    break;
                case "look":
                  $localStorage.legalizacion = row.entity;
                  $window.open('#/tesoreria/avances/solicitud/ev_legalizacion_tipo/'+row.entity.TipoAvanceLegalizacion.NumeroOrden, '_blank', 'location=yes');
                break;
            }
        };



        $scope.loadrowOPAvance = function(row, operacion) {
            ctrl.row_entity = row.entity;
            ctrl.operacion = operacion;
            switch (operacion) {
                case "deleteOP":
                    ctrl.delete_OPAvance();
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
        }
        ctrl.agregarOP = function(){
          $('#modal_add_ordenPago').modal('show');
          $interval( function() {
              ctrl.gridOPApi.core.handleWindowResize();
            }, 500, 2);
        }

        ctrl.guardarOPAvance = function (){
          if(ctrl.ordenesPago.length>0){
            var request = {
              OPAvance:ctrl.ordenesPago
            }
            financieraRequest.post('orden_pago_avance_legalizacion/AddOPAvance',request).then(function(response) {
                  swal('',$translate.instant(response.data.Code),response.data.Type).then(function(){
                    $("#modal_add_ordenPago").modal('hide');
                  });
            });
          }
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
                      query: "AvanceLegalizacion.Id:"+$scope.solicitud.avancelegalizacion.Id, //Impuesto RETE IVA
                      limit: -1
                  }))
              .then(function(response) {
                if(typeof(response.data)!=="string"){
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

        ctrl.delete_OPAvance= function() {
            swal({
                title: 'Está seguro ?',
                text: $translate.instant('ELIMINARA') + ' ' + $translate.instant('ORDEN_DE_PAGO')+' '+ctrl.row_entity.OrdenPago.Consecutivo,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR')
            }).then(function() {

                financieraRequest.delete("orden_pago_avance_legalizacion", ctrl.row_entity.Id)
                    .then(function(response) {
                        if (response.status === 200) {
                            swal(
                                $translate.instant('ELIMINADO'),
                                 $translate.instant('ORDEN_DE_PAGO')+' '+ctrl.row_entity.OrdenPago.Consecutivo+ ' ' + $translate.instant('FUE_ELIMINADO'),
                                'success'
                            );
                            ctrl.cargarOrdenesPagoAvance(0,'');
                        }
                    });
            })
        };

        ctrl.get_all_avance_legalizacion_practica = function() {
            financieraMidRequest.get("legalizacion_avance/GetAllLegalizacionTipo", $.param({
                    query: "AvanceLegalizacion.Id:" + $scope.solicitud.avancelegalizacion.Id + ",TipoAvanceLegalizacion.Id:1,EstadoAvanceLegalizacionTipo.NumeroOrden:1",
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
                    query: "AvanceLegalizacion.Id:" + $scope.solicitud.avancelegalizacion.Id + ",TipoAvanceLegalizacion.Id:2,EstadoAvanceLegalizacionTipo.NumeroOrden:1",
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
              if(response.data != null){
                $scope.solicitud.avancelegalizacion = response.data.avanceLegalizacion[0];
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
                    console.log(ctrl.LegalizacionCompras);
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

/* pasar a consulta por tipo
      ctrl.getConceptoAvance = function(){
        financieraRequest.get('concepto_avance_legalizacion',$.param({
          query: "Avance.Id:"+$scope.solicitud.Id,
          limit: -1
        })).then(function(response){
          if(!ctrl.revisarNoRow(response.data) && response.data != null){
            ctrl.concepto[0] = response.data[0].Concepto;
            $scope.nodo = response.data[0].Concepto;
            ctrl.notLoadConcepto = true;
          }
        });
      }

      ctrl.getMovimientosContables = function(){
        financieraRequest.get('tipo_documento_afectante',$.param({
          query: "CodigoAbreviacion:DA-LA",
          fields: "Id",
          limit: -1
        })).then(function(response){
          var idDocumento = response.data[0].Id;
          financieraRequest.get('movimiento_contable',$.param({
            query:"TipoDocumentoAfectante.Id:"+idDocumento+",CodigoDocumentoAfectante:"+$scope.solicitud.Id,
            limit: -1
          })).then(function(response){
            if (response.data!=null && !ctrl.revisarNoRow(response.data) ){
              ctrl.movContablesEnc = true;
              ctrl.movs = response.data;
            }
          });

        });
      }

      ctrl.revisarNoRow = function(obj){
        if(typeof(obj)==="string"){
        if(obj.indexOf("no row found")>=0) {
          return true;
        }
        }
      return false;
      }
*/

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
      $scope.$watch('legalizacion.CRPSelecc',function(){
        if(!angular.isUndefined(ctrl.CRPSelecc)){
          ctrl.cargarOrdenesPago(ctrl.CRPSelecc.Id);
        }
      });
      $scope.$watch('c', function() {
          if($scope.c){
            $interval( function() {
                ctrl.gridOPApi.core.handleWindowResize();
              }, 500, 2);


          }
        });

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
    });
