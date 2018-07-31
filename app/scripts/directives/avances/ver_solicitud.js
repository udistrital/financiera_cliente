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

      controller: function($scope,$translate,administrativaPruebasRequest,$interval,financieraMidRequest,$window) {
        var ctrl = this;

        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        ];

        $scope.botonesCRP = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'vercrp', estado: true },
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
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          useExternalPagination: true,
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
               width: "15%",
            },
            {
              field: 'NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO'),
              cellClass: 'input_center',
               headerCellClass: 'encabezado',
               width: "15%",
            },
            {
              field: 'FechaRegistro',
              cellClass: 'input_center',
              displayName: $translate.instant('FECHA_REGISTRO'),
              cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
               headerCellClass: 'encabezado',
               width: "20%",
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
               headerCellClass: 'encabezado',
              cellClass: 'input_center',
              width: "20%",
            },
            {
              field: 'InfoSolicitudDisponibilidad.DependenciaSolicitante.Nombre',
              displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
              enableFiltering: false,
              headerCellClass: 'encabezado',
              cellClass: 'input_center',
              width: "20%",
            },
            {
              field: $translate.instant('OPERACION'),
              cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botonesCRP" fila="row"></btn-registro></center>',
              enableFiltering: false,
              headerCellClass: 'encabezado',
              width: "10%",
            }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridCRPApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              $scope.crpselecc = row.entity;
              console.log(row.entity);
              console.log("unidad ejecutora ",row.entity.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.UnidadEjecutora);
            });
          }
        };

        $scope.$watch('sol', function() {
          ctrl.solicitud = $scope.sol;
          ctrl.tipo_avance = $scope.tipos;
        });

        ctrl.cargar_info_presupuestal= function(){
          administrativaPruebasRequest.get("necesidad_proceso_externo",
                  $.param({
                      query: "proceso_externo:" + $scope.sol.Id + ",TipoNecesidad.NumeroOrden:3",
                      limit: -1
                  })).then(function(response){
                    if(response.data[0].Necesidad!=null){}else{
                      response.data = [{"Id": 3,"Necesidad":{"Id":102587,"Numero":101}}];
                      ctrl.necesidadinfoPresupuestal = response.data[0].Necesidad;
                      financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/"+ ctrl.necesidadinfoPresupuestal.Id,'').then(function(response){
                        ctrl.infoPresupuestal = response.data[0].DisponibilidadApropiacion.map(function(da){
                          var respuesta;
                          respuesta = {disponibilidad:da.Disponibilidad,
                                      necesidad:ctrl.necesidadinfoPresupuestal}
                          return respuesta;} );
                        ctrl.gridInfPresupuesto.data = ctrl.infoPresupuestal;
                        console.log(ctrl.infoPresupuestal);
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
                      });
                    }
                  });
        }
        ctrl.cargar_info_presupuestal();
        $scope.loadrow = function(row, operacion) {
            $scope.solicitud = row.entity;
            console.log($scope.solicitud);
            switch (operacion) {
                case "vercrp":
                    break;
                default:
                break;
            }
        };
        $scope.verDisponibilidad = function(row){
          var numero = row.entity.disponibilidad.NumeroDisponibilidad;
          var vigencia = row.entity.disponibilidad.Vigencia;
          $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');
        };
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
