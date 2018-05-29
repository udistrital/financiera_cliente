'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:parametros/gestion
 * @description
 * # parametros/gestion
 */
angular.module('financieraClienteApp')
  .directive('parametrosGestion', function ($translate) {
    return {
      restrict: 'E',
      scope:{
          nombreparametro: '=',
          nombreservicio:'=',
          tituloparametro:'=?',
          subtituloparametro:'=?'
        },

      templateUrl: 'views/directives/parametros/gestion.html',
      controller:function($scope,$attrs,$injector,uiGridConstants){
        var ctrl = this;
        var service = $injector.get($scope.nombreservicio);
        var emptyData = [];
        $scope.botones=[
          {clase_color:"editar",clase_css:"fa fa-pencil fa-lg animated-hover",titulo:$translate.instant("BTN.EDITAR"),operacion:"editar",estado:true},
          {clase_color:"borrar",clase_css:"fa fa-trash fa-lg animated-hover",titulo:$translate.instant("BTN.BORRAR"),operacion:"eliminar",estado:true}
        ];

        ctrl.parameters = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            columnDefs:[{
                    field: 'CodigoAbreviacion',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                    headerCellClass:'text-info'
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '15%',
                    headerCellClass:'text-info'
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '57%',
                    headerCellClass:'text-info'
                },
                {
                    field: 'Activo',
                    displayName: $translate.instant('ACTIVO'),
                    cellTemplate: '<div class="middle"><md-checkbox aria-label="activo" ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                    width: '10%',
                    headerCellClass:'text-info'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '12%',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
                    headerCellClass:'text-info'
                }
            ],
            onRegisterApi: function(gridApi){ $scope.gridApi = gridApi;}
        };
        ctrl.getParametros = function(){
          var querySet="";
          if($scope.nombreparametro==="documento"&& $scope.nombreservicio ==="coreRequest"){
            querySet = "TipoDocumento.Id:5";
          }
          service.get($scope.nombreparametro,$.param({
            query:querySet,
            limit:-1,
            sortby:"Id",
            order:"asc"
          })).then(function(response){
            ctrl.parameters.data = response.data;
            if (response.data===null) {
              ctrl.parameters.data = emptyData;
            }
          });
        };

        ctrl.getParametros();



        $scope.loadrow = function(row, operacion) {
          ctrl.operacion = operacion;
          switch (operacion) {
              case "eliminar":
                  ctrl.row_entity = row.entity;
                  ctrl.eliminar();
                  break;
              case "agregar":
                  ctrl.CodigoAbreviacion = "";
                  ctrl.Nombre = "";
                  ctrl.Descripcion = "";
                  $('#modalEdit').modal('show');
                  break;
              case "editar":
                  ctrl.row_entity = row.entity
                  ctrl.CodigoAbreviacion = row.entity.CodigoAbreviacion;
                  ctrl.Nombre = row.entity.Nombre;
                  ctrl.Descripcion = row.entity.Descripcion;
                  ctrl.Activo = row.entity.Activo;
                  ctrl.FechaRegistro = row.entity.FechaRegistro;
                  $('#modalEdit').modal('show');
                  break;
              default:
          }
        };

        ctrl.eliminar = function() {
            swal({
                title: 'CONFIRMAR',
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.CodigoAbreviacion,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR'),
                cancelButtonText:$translate.instant('BTN.CANCELAR')
            }).then(function() {
                service.delete($scope.nombreparametro, ctrl.row_entity.Id)
                    .then(function(response) {
                        if (response.data === "OK") {
                            swal(
                                $translate.instant('ELIMINADO'),
                                ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ELIMINADO'),
                                'success'
                            );
                              ctrl.getParametros();
                        }else{
                          swal(
                              $translate.instant('ERROR_ELIMINAR'),
                              ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('E_04566'),
                              'error'
                          );
                        }
                    });
            })
        };

        ctrl.modalEdit=function(){
          ctrl.parameter={
            CodigoAbreviacion: ctrl.CodigoAbreviacion,
            Nombre: ctrl.Nombre,
            Descripcion: ctrl.Descripcion
          };
          if($scope.nombreparametro==="documento"&& $scope.nombreservicio ==="coreRequest"){
            ctrl.parameter.TipoDocumento = {Id:5};
          }
          switch (ctrl.operacion){
            case "editar":
            ctrl.parameter.Id = ctrl.row_entity.Id;
            ctrl.parameter.FechaRegistro =  ctrl.row_entityFechaRegistro;
            ctrl.parameter.Activo= ctrl.Activo;
            service.put($scope.nombreparametro, ctrl.parameter.Id, ctrl.parameter)
                .then(function(response) {
                    if (response.status === 200) {
                        swal(
                            $translate.instant('ACTUALIZADO'),
                            ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                            'success'
                        );
                        ctrl.getParametros();
                    }
                });
            break;
            case "agregar":
            ctrl.parameter.Activo = true;
            service.post($scope.nombreparametro,ctrl.parameter)
                .then(function(response) {
                    if (response.statusText === "Created") {
                        swal(
                            $translate.instant('CREADO'),
                            $translate.instant('REGISTRO_CORRECTO'),
                            'success'
                        );
                        ctrl.getParametros();
                    }
                });
            break;
          }
          $('#modalEdit').modal('hide');
        }


      },
      controllerAs:'d_parametros_gestion'
    };
  });
