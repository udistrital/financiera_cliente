'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionBancosCtrl
 * @description
 * # BancosGestionBancosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('GestionBancosCtrl', function(financieraRequest,administrativaRequest, organizacionRequest,coreRequest, $scope, $translate, uiGridConstants, $location, $route,$window) {
        var ctrl = this;


        $scope.botones_agregar_codigos = [
            { clase_color: "editar", clase_css: "fa fa-plus fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.AGREGAR_CODIGOS'), operacion: 'ver_modal_info_adicional', estado: true },
            { clase_color: "editar", clase_css: "fa fa-home fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_SUCURSAL'), operacion: 'ver_sucursal', estado: true },
        ];

        $scope.botones_editar_codigos = [
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR_CODIGOS'), operacion: 'ver_modal_info_adicional', estado: true },
            { clase_color: "editar", clase_css: "fa fa-home fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_SUCURSAL'), operacion: 'ver_sucursal', estado: true },
        ];


        ctrl.Sucursales = {
            paginationPageSizes: [5, 10, 15, 20, 50],
            paginationPageSize: 5,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [{
                    field: 'Id',
                    visible: false,

                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

                }
            ]
        };

        ctrl.Sucursales.multiSelect = false;
        ctrl.Sucursales.modifierKeysToMultiSelect = false;
        ctrl.Sucursales.enablePaginationControls = true;
        ctrl.Sucursales.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.sucursal_seleccionada = row.entity;
            });
        };

        ctrl.Bancos = {
            paginationPageSizes: [5, 10, 15, 20, 50],
            paginationPageSize: 5,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [
                {
                    field: 'Id',
                    visible: false
                },
                {
                    field: 'IdInformacionAdicional',
                    visible: false
                },
                {
                    field: 'InformacionPersonaJuridicaId.Id',
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    },
                    displayName: $translate.instant('NIT'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '25%'
                },
                /*{
                  field: 'DenominacionBanco',
                  displayName: $translate.instant('DENOMINACION'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '20%'
                },*/
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '25%'
                },

                {
                  field: 'CodigoSuperintendencia',
                  displayName: $translate.instant('CODIGO_SUPER'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '10%',
                  cellFilter: "filtro_codigo_super:row.entity"
                },
                {
                  field: 'CodigoAch',
                  displayName: $translate.instant('ACH'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '10%',
                  cellFilter: "filtro_codigo_ach:row.entity"
                },
                {
                    field: 'Estado',
                    displayName: $translate.instant('ACTIVO'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '10%',
                    cellFilter: "filtro_estado_banco:row.entity"
                },
                {
                    field: 'Opciones',
                    displayName: $translate.instant('OPCIONES'),
                    cellTemplate: '<center><a ng-if="row.entity.CodigoSuperintendencia == 0 "> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_agregar_codigos" fila="row"></btn-registro><center></a>'+
                    '<center><a ng-if="row.entity.CodigoSuperintendencia !=0"> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_editar_codigos" fila="row"></btn-registro><center></a>',
                    headerCellClass: 'text-info',
                    width: '20%'
                }
            ]
        };

        //opciones extras para el control del grid
        ctrl.Bancos.multiSelect = false;
        ctrl.Bancos.modifierKeysToMultiSelect = false;
        ctrl.Bancos.enablePaginationControls = true;
        ctrl.Bancos.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {
                ctrl.cuenta = ctrl.gridApi.selection.getSelectedRows()[0];
            });
        };

        organizacionRequest.get('organizacion/', $.param({
            limit: -1,
            query: "TipoOrganizacion.CodigoAbreviacion:EB",
        })).then(function(response) {

          angular.forEach(response.data, function(data){
            financieraRequest.get('informacion_adicional_banco','limit=-1&query=Banco:'+data.Id).then(function(response) {
              if(response.data == null){
                data.CodigoAch = 0
                data.CodigoSuperintendencia = 0
                data.IdInformacionAdicional = 0
              }else{
                data.CodigoAch = response.data[0].CodigoAch
                data.CodigoSuperintendencia = response.data[0].CodigoSuperintendencia
                data.IdInformacionAdicional = response.data[0].Id
              }

            });
          });

            ctrl.Bancos.data = response.data;
        });

        $scope.loadrow = function(row, operacion) {
            ctrl.operacion = operacion;
            switch (operacion) {
                case "ver_modal_info_adicional":
                    ctrl.ver_modal_info_adicional(row);
                    break;
                case "ver_sucursal":
                    ctrl.ver_sucursal(row);
                    break;
                default:
            }
        };

        ctrl.ver_modal_info_adicional = function(row) {
              ctrl.banco_seleccionado_info_adicional = row.entity;
              if(row.entity.CodigoSuperintendencia != 0 || row.entity.CodigoAch != 0){
                ctrl.codigo_super = row.entity.CodigoSuperintendencia;
                ctrl.codigo_ach = row.entity.CodigoAch;
                ctrl.edicion_codigos = true;
                ctrl.id_a_editar = row.entity.IdInformacionAdicional
              }

              if(row.entity.CodigoSuperintendencia == 0 || row.entity.CodigoAch == 0){
                ctrl.codigo_super = null;
                ctrl.codigo_ach = null;
                ctrl.edicion_codigos = false;
              }

              $("#modal_informacion_adicional").modal("show");



        };

        ctrl.agregar_informacion_adicional = function() {

        if (ctrl.codigo_ach && ctrl.codigo_super) {

            var informacion_adicional_banco = {
              CodigoSuperintendencia:  parseInt(ctrl.codigo_super),
            	CodigoAch :  parseInt(ctrl.codigo_ach),
            	Banco   : ctrl.banco_seleccionado_info_adicional.Id
            }

            if(ctrl.edicion_codigos == false){

                  financieraRequest.post('informacion_adicional_banco', informacion_adicional_banco).then(function(response) {

                      if (typeof(response.data) == "object") {
                          swal({
                              html: $translate.instant('INFORMACION_REG_CORRECTO'),
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#449D44",
                              confirmButtonText: $translate.instant('VOLVER'),
                          }).then(function() {
                              $('#modal_informacion_adicional').modal('hide');
                              $window.location.reload()
                          })

                      }
                      if (typeof(response.data) == "string") {
                          swal({
                              html: $translate.instant('INFORMACION_REG_INCORRECTO'),
                              type: "error",
                              showCancelButton: false,
                              confirmButtonColor: "#449D44",
                              confirmButtonText: $translate.instant('VOLVER'),
                          }).then(function() {
                              $('#informacion_adicional_banco').modal('hide');
                              $window.location.reload()
                          })

                      }
                  });

                }

        if(ctrl.edicion_codigos == true){

          swal({
                    html: $translate.instant('CONFIRMACION_EDICION') +
                        "<br><b>" + $translate.instant('CONCEPTO_SUPER') + ":</b> " + ctrl.codigo_super+
                        "<br><b>" + $translate.instant('CONCEPTO_ACH') + ":</b> " + ctrl.codigo_ach + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#449D44",
                    cancelButtonColor: "#C9302C",
                    confirmButtonText: $translate.instant('CONFIRMAR'),
                    cancelButtonText: $translate.instant('CANCELAR'),
         }).then(function() {

              financieraRequest.put('informacion_adicional_banco', ctrl.id_a_editar,informacion_adicional_banco).then(function(response) {

                  if (response.data == "OK") {
                      swal({
                          html: $translate.instant('INFORMACION_REG_CORRECTO'),
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#449D44",
                          confirmButtonText: $translate.instant('VOLVER'),
                      }).then(function() {
                          $('#modal_informacion_adicional').modal('hide');
                          $window.location.reload()
                      })

                  }
                 else{
                      swal({
                          html: $translate.instant('INFORMACION_REG_INCORRECTO'),
                          type: "error",
                          showCancelButton: false,
                          confirmButtonColor: "#449D44",
                          confirmButtonText: $translate.instant('VOLVER'),
                      }).then(function() {
                          $('#informacion_adicional_banco').modal('hide');
                          $window.location.reload()
                      })

                  }
              });
            })
          }

    } else {
                swal({
                    html: $translate.instant('ALERTA_COMPLETAR_DATOS_EDICION'),
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#449D44",
                    confirmButtonText: $translate.instant('VOLVER'),
                })
              }

        };

        ctrl.ver_sucursal = function(row) {

          ctrl.banco_a_vincular_sucursal = row.entity;
          //DEBO BUSCAR SI TIENE RELACION EN LA TABLA RELACION_ORGANIZACION
          organizacionRequest.get('relacion_organizaciones/', $.param({
            limit: -1,
            query: "OrganizacionPadre:" + row.entity.Id,
          })).then(function(response) {
                if (response.data == null) {
                    ctrl.tieneSucursal = false;
                } else {
                    ctrl.tieneSucursal = true;
                    ctrl.buscar_informacion_sucursal(response.data[0].OrganizacionHija);
                  //  ctrl.NombreSucursal = response.data[0].Nombre;
                }
            });
            $("#modal_sucursal").modal("show");
            //Si tiene, que permita visualizarla en un modal, en este modal, que se permita desvincularla. Si no tiene, que sea un botón que permite agregar, listando las existentes
        };

        ctrl.desvincular_sucursal = function() {
            alert("desvinculando sucursal")
        };

        ctrl.mostrar_sucursales = function() {
            ctrl.ver_grid_sucursales = true;

            organizacionRequest.get('organizacion/', $.param({
                limit: -1,
                query: "TipoOrganizacion.CodigoAbreviacion:SU",
            })).then(function(response) {
                if (response.data == null) {
                    //PONER MARCA DE AGUA DE QUE NO HAY
                } else {
                    ctrl.Sucursales.data = response.data;
                }

            });

        };

        ctrl.vincular_sucursal = function() {
            if($scope.sucursal_seleccionada == null){
              alert("seleccione sucursal")
            }else{

            organizacionRequest.get('tipo_relacion_organizaciones/', $.param({
                  limit: -1,
                  query: "CodigoAbreviacion:TRO_1",
              })).then(function(response) {
                  if (response.data == null) {
                      console.log("no hay datos de tipo de relacion")
                  } else {
                    //Variable para hacer insert en relacion_organizaciones
                    var objeto_relacion_organizaciones = {
                      OrganizacionPadre : ctrl.banco_a_vincular_sucursal.Id,
                      OrganizacionHija :  $scope.sucursal_seleccionada.Id,
                      TipoRelacionOrganizaciones : {Id: response.data[0].Id}
                    }

                    organizacionRequest.post('relacion_organizaciones', objeto_relacion_organizaciones).then(function(response) {

                        if (typeof(response.data) == "object") {
                            swal({
                                html: $translate.instant('INFORMACION_REG_CORRECTO'),
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#449D44",
                                confirmButtonText: $translate.instant('VOLVER'),
                            }).then(function() {
                                  $("#modal_sucursal").modal("hide");
                                $window.location.reload()
                            })

                        }
                        if (typeof(response.data) == "string") {
                            swal({
                                html: $translate.instant('INFORMACION_REG_INCORRECTO'),
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#449D44",
                                confirmButtonText: $translate.instant('VOLVER'),
                            }).then(function() {
                                $("#modal_sucursal").modal("hide");
                                $window.location.reload()
                            })

                        }
                    });

                  }

              });
            }
        };

        ctrl.buscar_informacion_sucursal = function (id_sucursal){
          //Buscar info de organizacion hija
          organizacionRequest.get('organizacion/', $.param({
              limit: -1,
              query: "TipoOrganizacion.CodigoAbreviacion:SU,Id:"+id_sucursal,
          })).then(function(response) {
              if (response.data == null) {
                  //PONER MARCA DE AGUA DE QUE NO HAY
              } else {
                  ctrl.NombreSucursal = response.data[0].Nombre;
              }

          });
        };

        ctrl.gestionar_sucursales = function() {
            $location.path('/bancos/gestion_sucursales');
            $route.reload()

        };

        ctrl.gestionar_cuentas_bancarias = function() {
            $location.path('/bancos/gestion_cuentas_bancarias');
            $route.reload()

        };
    }).filter('filtro_estado_banco', function($filter) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.Estado === 1) {
                output = "Activo";
            }

            if (entity.Estado !== 1) {
                output = "Inactivo";
            }


            return output;
        };
    }).filter('filtro_codigo_ach', function($filter) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.CodigoAch === 0) {
                output = "No asignado";
            }else{
                output = entity.CodigoAch;
            }

            return output;
        };
    }).filter('filtro_codigo_super', function($filter) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.CodigoSuperintendencia === 0) {
                output = "No asignado";
            }else{
              output = entity.CodigoSuperintendencia;
            }


            return output;
        };
    });
