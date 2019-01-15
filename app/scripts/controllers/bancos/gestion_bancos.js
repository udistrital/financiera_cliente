'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionBancosCtrl
 * @description
 * # BancosGestionBancosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('GestionBancosCtrl', function(financieraMidRequest, financieraRequest,administrativaRequest, organizacionRequest,coreRequest, $scope, $translate, uiGridConstants, $location, $route,$window) {
        var ctrl = this;


        $scope.botones_agregar_codigos = [
            { clase_color: "editar", clase_css: "fa fa-plus fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.AGREGAR_CODIGOS'), operacion: 'ver_modal_info_adicional', estado: true },
            { clase_color: "editar", clase_css: "fa fa-home fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_SUCURSAL'), operacion: 'ver_sucursal', estado: true },
        ];

        $scope.botones_editar_codigos = [
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'ver_modal_info_adicional', estado: true },
            { clase_color: "editar", clase_css: "fa fa-home fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER_SUCURSAL'), operacion: 'ver_sucursal', estado: true },
        ];

        ctrl.Sucursales = {
          paginationPageSizes: [5, 10, 15, 20, 50],
          paginationPageSize: 5,
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableFiltering: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          useExternalPagination: false,
          selectionRowHeaderWidth:35,
          enableSelectAll: true,
          columnDefs: [{
              field: 'Id',
              visible:false,

            },
            {
              field: 'Organizacion.Nombre',
              name: $translate.instant('NOMBRE'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

            },
            {
              name: $translate.instant('DIRECCION'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.Direccion">{{row.entity.Direccion.Valor}}</div><div ng-if="!row.entity.Direccion">No Registrado</div>',

            },
            {
              name: $translate.instant('TELEFONO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.Telefono">{{row.entity.Telefono.Valor}}</div><div ng-if="!row.entity.Telefono">No Registrado</div>',
            },
            {
              name: $translate.instant('PAIS'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.Pais">{{row.entity.Pais.Nombre}}</div><div ng-if="!row.entity.Pais">No Registrado</div>',

            },
            {
              name: $translate.instant('DEPARTAMENTO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.Departamento">{{row.entity.Departamento.Nombre}}</div><div ng-if="!row.entity.Departamento">No Registrado</div>',

            },
            {
              name: $translate.instant('CIUDAD'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.Ciudad">{{row.entity.Ciudad.Nombre}}</div><div ng-if="!row.entity.Ciudad">No Registrado</div>',
            }
          ],
            onRegisterApi : function(gridApi) {
                ctrl.gridSucursalesApi = gridApi;
            }
        };


        ctrl.SucursalesBanco = {
          paginationPageSizes: [5, 10, 15, 20, 50],
          paginationPageSize: 5,
          enableFiltering: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          useExternalPagination: false,
          enableSelectAll: true,
          enableRowHeaderSelection: true,
          selectionRowHeaderWidth: 35,
          enableRowSelection: true,
          multiSelect:true,
          columnDefs: [{
              field: 'Id',
              visible:false,

            },
            {
              field: 'OrganizacionHija.Nombre',
              name: $translate.instant('NOMBRE'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

            },
            {
              name: $translate.instant('DIRECCION'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.OrganizacionHija.Direccion">{{row.entity.OrganizacionHija.Direccion.Valor}}</div><div ng-if="!row.entity.OrganizacionHija.Direccion">No Registrado</div>',

            },
            {
              name: $translate.instant('TELEFONO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.OrganizacionHija.Telefono">{{row.entity.OrganizacionHija.Telefono.Valor}}</div><div ng-if="!row.entity.OrganizacionHija.Telefono">No Registrado</div>',
            },
            {
              name: $translate.instant('PAIS'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.OrganizacionHija.Pais">{{row.entity.OrganizacionHija.Pais.Nombre}}</div><div ng-if="!row.entity.OrganizacionHija.Pais">No Registrado</div>',

            },
            {
              name: $translate.instant('DEPARTAMENTO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.OrganizacionHija.Departamento">{{row.entity.OrganizacionHija.Departamento.Nombre}}</div><div ng-if="!row.entity.OrganizacionHija.Departamento">No Registrado</div>',

            },
            {
              name: $translate.instant('CIUDAD'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTemplate:'<div ng-if="row.entity.OrganizacionHija.Ciudad">{{row.entity.OrganizacionHija.Ciudad.Nombre}}</div><div ng-if="!row.entity.OrganizacionHija.Ciudad">No Registrado</div>',
            }
          ],
          onRegisterApi : function(gridApi) {
              ctrl.gridApiSucursalesBanco = gridApi;
          }
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
                    field: 'Identificacion.NumeroIdentificacion',
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    },
                    displayName: $translate.instant('NIT'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '20%'
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                    width: '20%'
                },

                {
                  field: 'CodigoSuperintendencia',
                  displayName: $translate.instant('CODIGO_SUPER'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '20%',
                  cellFilter: "filtro_codigo_super:row.entity"
                },
                {
                  field: 'CodigoAch',
                  displayName: $translate.instant('CODIGO_ACH'),
                  headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                  width: '20%',
                  cellFilter: "filtro_codigo_ach:row.entity"
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
        ctrl.modal_agregar_banco = function (){
            $("#addBanco").modal("show");
        }
        ctrl.cargar_bancos = function (){
        financieraMidRequest.get('gestion_sucursales/ListarBancos/',null).then(function(response) {
            ctrl.Bancos.data = response.data;
        });
      }

      ctrl.cargar_bancos();

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

                        var templateAlert = "<table class='table table-bordered'><th>" +'<center>' +$translate.instant('BANCO') + "</center></th><th><center>" + $translate.instant('CODIGO_SUPER') + "</center></th><th><center>" + $translate.instant('CODIGO_ACH') + "</center></th>";
                        templateAlert = templateAlert + "<tr class='success'><td>"+informacion_adicional_banco.Banco+"</td>" + "<td>" +informacion_adicional_banco.CodigoSuperintendencia + "</td>"+ "<td>" + informacion_adicional_banco.CodigoAch + "</td></tr>" ;
                        templateAlert = templateAlert + "</table>";

                          swal({
                              title:$translate.instant('INFORMACION_REG_CORRECTO'),
                              html: templateAlert ,
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#449D44",
                              confirmButtonText: $translate.instant('VOLVER'),
                          }).then(function() {
                              $('#modal_informacion_adicional').modal('hide');
                              ctrl.cargar_bancos();
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
                                ctrl.cargar_bancos();
                          })

                      }
                  });

                }

        if(ctrl.edicion_codigos == true){

          swal({
                    html: $translate.instant('BTN.CONFIRMAR') +
                        "<br><b>" + $translate.instant('CODIGO_SUPER') + ":</b> " + ctrl.codigo_super+
                        "<br><b>" + $translate.instant('CODIGO_ACH') + ":</b> " + ctrl.codigo_ach + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#449D44",
                    cancelButtonColor: "#C9302C",
                    confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
                    cancelButtonText: $translate.instant('BTN.CANCELAR'),
         }).then(function() {

              financieraRequest.put('informacion_adicional_banco', ctrl.id_a_editar,informacion_adicional_banco).then(function(response) {

                  if (response.data == "OK") {

                    var templateAlert = "<table class='table table-bordered'><th>" +'<center>' +$translate.instant('BANCO') + "</center></th><th><center>" + $translate.instant('CODIGO_SUPER') + "</center></th><th><center>" + $translate.instant('CODIGO_ACH') + "</center></th>";
                    templateAlert = templateAlert + "<tr class='success'><td>"+informacion_adicional_banco.Banco+"</td>" + "<td>" +informacion_adicional_banco.CodigoSuperintendencia + "</td>"+ "<td>" + informacion_adicional_banco.CodigoAch + "</td></tr>" ;
                    templateAlert = templateAlert + "</table>";

                      swal({
                          title: $translate.instant('INFORMACION_REG_CORRECTO'),
                          html: templateAlert,
                          type: "success",
                          showCancelButton: false,
                          confirmButtonColor: "#449D44",
                          confirmButtonText: $translate.instant('VOLVER'),
                      }).then(function() {
                          $('#modal_informacion_adicional').modal('hide');
                          ctrl.cargar_bancos();

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
                          ctrl.cargar_bancos();
                      })

                  }
              });
            })
          }

    } else {
                swal({
                    html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
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
          financieraMidRequest.get('gestion_sucursales/ListarSucursalesBanco/'+ row.entity.Id,null).then(function(response){
              ctrl.SucursalesBanco.data = response.data;
              $("#modal_sucursal").modal("show");
            });
        };

        ctrl.desvincular_sucursal = function() {
           financieraMidRequest.post('gestion_sucursales/DesvincularSucursales', ctrl.gridApiSucursalesBanco.selection.getSelectedRows()).then(function(response){
             swal("",$translate.instant(response.data.Code),response.data.Type).then(function() {
                $("#modal_sucursal").modal("hide");
                   if(response.data.Type==="success"){
                       $("#modal_sucursal").modal("hide");
                   }
             })
           });
        };

        ctrl.mostrar_sucursales = function() {
            if(!ctrl.ver_grid_sucursales){
              ctrl.ver_grid_sucursales = true;
              financieraMidRequest.get('gestion_sucursales/listar_sucursales',null).then(function(response) {
                    ctrl.Sucursales.data = response.data;
              });
            }
        };

        $scope.$watch("vs", function(newValue){
           if(!angular.isUndefined(newValue) && newValue){
             ctrl.mostrar_sucursales();
           }
        },true);



        ctrl.vincular_sucursal = function() {
          var request = [];
            if( ctrl.gridSucursalesApi.selection.getSelectedRows().length === 0){
              swal("",$translate.instant("SELECCIONAR_SUCURSAL"),"error");
            }else{
                    //Variable para hacer insert en relacion_organizaciones
                      angular.forEach( ctrl.gridSucursalesApi.selection.getSelectedRows(), function(data){
                        console.log(data);
                        var objeto_relacion_organizaciones = {
                          OrganizacionPadre : ctrl.banco_a_vincular_sucursal.Id,
                          OrganizacionHija :  data.Organizacion.Id
                        };
                        request.push(objeto_relacion_organizaciones);
                      });
                        financieraMidRequest.post('gestion_sucursales/VincularSucursales', request).then(function(response) {
                                swal("",$translate.instant(response.data.Code),response.data.Type).then(function() {
                                      $("#modal_sucursal").modal("hide");
                                })
                        });
            }
        }

        ctrl.buscar_informacion_sucursal = function (id_sucursal){
          //Buscar info de organizacion hija


          financieraMidRequest.get('gestion_sucursales/listar_sucursal','id_sucursal='+id_sucursal).then(function(response) {
            if (response.data == null) {
                //PONER MARCA DE AGUA DE QUE NO HAY
            } else {
                ctrl.Nombre = response.data[0].Nombre;
                ctrl.Direccion = response.data[0].Direccion;
                ctrl.Telefono = response.data[0].Telefono;
                ctrl.Pais = response.data[0].Pais;
                ctrl.Departamento = response.data[0].Departamento;
                ctrl.Ciudad = response.data[0].Ciudad;
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
