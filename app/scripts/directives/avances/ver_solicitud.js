'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verSolicitud
 * @description
 * # verSolicitud
 */
angular.module('financieraClienteApp')
  .directive('verSolicitud', function() {
    return {
      restrict: 'E',
      scope: {
        sol: '=?',
        tipos: '=?',
        crpselecc:'=?'
      },
      templateUrl: 'views/directives/avance/ver_solicitud.html',

      controller: function($scope,$translate,administrativaPruebasRequest,$interval,financieraMidRequest,$window,uiGridConstants,financieraRequest,gridApiService,$location, agoraRequest,$attrs) {
        var ctrl = this;
        ctrl.seleccionCRP = "seleccioncrp" in $attrs;
        ctrl.ordenesPago=[];
        ctrl.rubrosAfectados=[];

        $scope.sol.valorLegalizado = 0;

        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        ];

        $scope.botonesCRP = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'vercrp', estado: true },
        ];
        $scope.botonesOp = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'deleteOP', estado: true }
        ];

        ctrl.cargando = true;
        ctrl.hayData = true;
        ctrl.infoPresupuestal={};

        ctrl.gridInfPresupuesto = {
          enableFiltering: false,
          enableSorting: false,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          columnDefs: [
              {
                  field: 'necesidad.Numero',
                  displayName: $translate.instant('NECESIDAD_NO'),
                  width: '50%',
                  headerCellClass: 'encabezado',
              },
              {
                  name: $translate.instant('NO_CDP'),
                  width: '50%',
                  headerCellClass: 'encabezado',
                  cellTemplate: '<div class="ngCellText" ><a href="" ng-click="grid.appScope.verDisponibilidad(row)">{{row.entity.disponibilidad.NumeroDisponibilidad}}</a></div>'
              },
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridPresupuestoApi = gridApi;
          }
        };

        ctrl.gridCRP = {
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          paginationPageSizes: [5, 10, 15],
          enableSelectAll: false,
          paginationPageSize: 5,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center',
              enableFiltering: false,
               headerCellClass: 'encabezado',
               width: "*",
            },
            {
              field: 'NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO'),
              cellClass: 'input_center',
               headerCellClass: 'encabezado',
               width: "*",
            },
            {
              field: 'FechaRegistro',
              cellClass: 'input_center',
              displayName: $translate.instant('FECHA_REGISTRO'),
              cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
               headerCellClass: 'encabezado',
               width: "*",
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
               headerCellClass: 'encabezado',
              cellClass: 'input_center',
              width: "20%",
            },
            {
              field: $translate.instant('OPERACION'),
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesCRP" fila="row"></btn-registro></center>',
              enableFiltering: false,
              headerCellClass: 'encabezado',
              width: "*",
            }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridCRPApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              $scope.crpselecc = row.entity;
              ctrl.CRPSelecc = row.entity;
            });
          }
        };

        ctrl.functionValidaSeleccionCRP = function (){
          if (ctrl.seleccionCRP) {
            ctrl.gridCRP.selectionRowHeaderWidth=35;
            ctrl.gridCRP.enableRowHeaderSelection= true;
            ctrl.gridCRP.enableRowSelection=true;
          }
        }

        ctrl.functionValidaSeleccionCRP();


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

        ctrl.gridOrdenesDePago = {
          enableRowSelection: true,
          enableSelectAll: false,
          selectionRowHeaderWidth: 35,
          multiSelect: false,
          enableRowHeaderSelection: true,
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
              width: '7%',
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
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'OrdenPago.ValorBase',
              width: '7%',
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
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrowOP(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
            }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridOPApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              ctrl.addOrdenPago(row.entity.OrdenPago.Id);
            });
          }
        };

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

      $scope.loadrowOPAvance = function(row, operacion) {
          ctrl.row_entity = row.entity;
          ctrl.operacion = operacion;
          switch (operacion) {
            case "ver":
              ctrl.op_detalle(row);
            break;
              case "deleteOP":
                  ctrl.delete_OPAvance();
                  break;
          }
      };

      $scope.$watch('d_verSolicitud.CRPSelecc',function(){
        if(!angular.isUndefined(ctrl.CRPSelecc)){
          ctrl.cargarOrdenesPago(ctrl.CRPSelecc.Id);
        }
      });

      $scope.loadrowOP = function(row, operacion) {
        self.operacion = operacion;
        switch (operacion) {
          case "otro":

          break;
            case "ver":
              ctrl.op_detalle(row);
            break;
            default:
            break;
        }
    };

    ctrl.op_detalle = function(row) {
      var path = "#/orden_pago/proveedor/ver/";
      $window.open(path+row.entity.OrdenPago.Id, '_blank', 'location=yes');
    }

        ctrl.cargarOrdenesPagoAvance = function(offset,query){
          var querybase = "Avance.Id:"+$scope.sol.Id;
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
              if (typeof(response.data)!="string") {
                ctrl.gridOrdenesDePagoAvance.data = response.data;
                angular.forEach(ctrl.gridOrdenesDePagoAvance.data,function(row){
                    $scope.addRubro(row.OrdenPago.Id);
                });
              }

          }
          });
      }

      ctrl.removeRubro=function(rubro){
        var idx = ctrl.rubrosAfectados.indexOf(rubro);
        ctrl.rubrosAfectados.splice(idx,1);
      }

      ctrl.cargarOrdenesPagoAvance(0,'');

      ctrl.cerrarModal = function (value){
        $("#"+value).modal('hide');
      }

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

        $scope.$watch('sol', function() {
          ctrl.solicitud = $scope.sol;
          ctrl.tipo_avance = $scope.tipos;
          ctrl.cargar_info_presupuestal();
        },false);

        $scope.$watch('c', function() {
            if($scope.c){
              $interval( function() {
                  ctrl.gridOPApi.core.handleWindowResize();
                }, 500, 2);
            }
          });

        ctrl.cargar_info_presupuestal= function(){
          if(angular.isUndefined($scope.sol)){
            return;
          }
          administrativaPruebasRequest.get("necesidad_proceso_externo",
                  $.param({
                      query: "proceso_externo:" + $scope.sol.Id + ",TipoNecesidad.NumeroOrden:3",
                      limit: -1
                  })).then(function(response){
                    if(response.data[0].Necesidad != null){
                      ctrl.necesidadinfoPresupuestal = response.data[0].Necesidad;
                      financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/"+ ctrl.necesidadinfoPresupuestal.Id,'').then(function(response){
                          if(!angular.isUndefined(response.data) && response.data != null){
                            ctrl.infoPresupuestal = response.data[0].DisponibilidadApropiacion.map(function(da){
                              var respuesta;
                              respuesta = {disponibilidad:da.Disponibilidad,
                                          necesidad:ctrl.necesidadinfoPresupuestal}
                              return respuesta;} );
                            ctrl.gridCRP.data = [];
                            ctrl.cargandoCRP = true;
                            ctrl.hayDataCRP = true;
                          if (response.data[0].registro_presupuestal === null && angular.isUndefined(response.data[0].registro_presupuestal)){
                                ctrl.hayDataCRP = false;
                                ctrl.cargandoCRP = false;
                                ctrl.gridCRP.data = [];
                              }else{
                                ctrl.hayDataCRP = true;
                                ctrl.cargandoCRP = false;
                                ctrl.gridCRP.data = response.data[0].registro_presupuestal;
                              }
                          }else{
                            ctrl.infoPresupuestal = [];
                            ctrl.infoPresupuestal.push({disponibilidad:{},necesidad:ctrl.necesidadinfoPresupuestal});
                          }
                          ctrl.gridInfPresupuesto.data = ctrl.infoPresupuestal;
                      });
                    }
                  });
        }
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
        $scope.loadrow = function(row, operacion) {
            switch (operacion) {
              case "otro":

              break;
                case "vercrp":
                  ctrl.verCRP(row.entity);
                    break;
                default:
                break;
            }
        };

        ctrl.verCRP = function(CRPInfo){
          var numero = CRPInfo.NumeroRegistroPresupuestal;
          var vigencia = CRPInfo.Vigencia;
          var unidadejecutora = CRPInfo.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.UnidadEjecutora;
          $window.open('#/rp/rp_consulta?vigencia='+vigencia+'&numero='+numero+'&unidadejecutora='+unidadejecutora, '_blank', 'location=yes');
        }

        ctrl.guardarOPAvance = function (){
          if(ctrl.ordenesPago.length>0){
            var request = {
              OPAvance:ctrl.ordenesPago
            }
            financieraRequest.post('orden_pago_avance_legalizacion/AddOPAvance',request).then(function(response) {
                  swal('',$translate.instant(response.data.Code),response.data.Type).then(function(){
                    $("#modal_add_ordenPago").modal('hide');
                      ctrl.cargarOrdenesPagoAvance(0,'');
                  });
            });
          }
        }

        ctrl.agregarOP = function(){
          $('#modal_add_ordenPago').modal('show');
          $interval( function() {
              ctrl.gridOPApi.core.handleWindowResize();
            }, 500, 2);
        }

        $scope.verDisponibilidad = function(row){
          var numero = row.entity.disponibilidad.NumeroDisponibilidad;
          var vigencia = row.entity.disponibilidad.Vigencia;
          $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');
        };

        ctrl.addOrdenPago = function(id){
          var ordenPagoAvance;
          ordenPagoAvance = {
            OrdenPago:{Id:id},
            Avance:{Id:$scope.sol.Id}
          };
          if (ctrl.ordenesPago.indexOf(ordenPagoAvance)===-1){
              ctrl.ordenesPago.push(ordenPagoAvance);
          }

        }

        ctrl.cargarLegalizaciones = function(){
          financieraMidRequest.get('legalizacion_avance/GetLegalizacionInformation/'+$scope.sol.Id,null).then(
            function(response){
              if(response.data != null){
                $scope.sol.valorLegalizado = response.data.Total;
              }
            }
          );
        }
        ctrl.cargarLegalizaciones();

        $scope.$watch('info_desc_avances', function() {
            if($scope.info_desc_avances){
              $interval( function() {
                  ctrl.gridCRPApi.core.handleWindowResize();
                  ctrl.gridPresupuestoApi.core.handleWindowResize();
                }, 500, 2);
            }
          });
      },
      controllerAs: 'd_verSolicitud'
    };
  });
