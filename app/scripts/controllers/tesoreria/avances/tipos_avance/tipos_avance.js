'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TiposAvanceCtrl
 * @description
 * # TiposAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('TiposAvanceCtrl', function($scope, financieraRequest, $translate) {
        var ctrl = this;
        ctrl.requisitos_tipo = {};
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.tipo_avance = {};
        ctrl.requisito_select = [];
        ctrl.hay_requisitos_conf = true;
        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
            { clase_color: "configuracion", clase_css: "fa fa-cog fa-lg faa-spin animated-hover", titulo: $translate.instant('BTN.CONFIGURAR'), operacion: 'config', estado: true },
            { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true }
        ];

        ctrl.grid_option_requisito = {

            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'IdTipo',
                    visible: false
                },
                {
                    field: 'RequisitoAvance.CodigoAbreviacion',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                }, {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    cellTemplate: '<div align="center">{{row.entity.RequisitoAvance.Nombre}}</div>',
                    width: '25%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    cellTemplate: '<div align="left">{{row.entity.RequisitoAvance.Descripcion}}</div>',
                    width: '45%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Estado',
                    displayName: $translate.instant('ESTADO'),
                    cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.RequisitoAvance.Activo" class="blue"></md-checkbox></div>',
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                }
            ]
        };

        ctrl.gridOptions = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'IdTipo',
                    visible: false
                },
                {
                    field: 'CodigoAbreviacion',
                    displayName: $translate.instant('CODIGO_ABREVIACION'),
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Nombre',
                    displayName: $translate.instant('NOMBRE'),
                    width: '15%',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '45%',
                    cellClass: 'text-align',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'Activo',
                    displayName: $translate.instant('ACTIVO'),
                    cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                    width: '10%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA'),
                    cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"UTC"}}</span></div>',
                    width: '12%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado'
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '8%',
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ]
        };
        ctrl.gridOptions.enablePaginationControls = true;
        ctrl.gridOptions.multiSelect = false;
        ctrl.get_all_avances = function() {
          ctrl.hayData_lista = true;
          ctrl.cargando_lista = true;
          ctrl.gridOptions.data = [];
          financieraRequest.get("tipo_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    if(response.data === null){
                      ctrl.hayData_lista = false;
                      ctrl.cargando_lista = false;
                      ctrl.gridOptions.data = [];
                    }else{
                      ctrl.hayData_lista = true;
                      ctrl.cargando_lista = false;
                      ctrl.gridOptions.data = response.data;
                    }

                });
        };

        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {});
        };

        ctrl.get_all_requisitos = function () {
            
             financieraRequest.get("requisito_avance", $.param({
                            limit: -1,
                            sortby: "Id",
                            order: "asc"
                        }))
                        .then(function(response) {
                            if(response.data === null){
                                ctrl.requisitos_select = null;
                            }else{
                                ctrl.requisitos_select = response.data;
                            }
                        });
        }

        ctrl.get_requisito_tipo_avance = function(id) {
          ctrl.hayData_tipos = true;
          ctrl.cargando_tipos = true;
          ctrl.grid_option_requisito.data = [];
            financieraRequest.get("requisito_tipo_avance", $.param({
                    query: "TipoAvance.Id:" + id,
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                  if(response.data === null){
                    ctrl.hayData_tipos = false;
                    ctrl.cargando_tipos = false;
                    ctrl.grid_option_requisito.data = [];
                  }else{
                    ctrl.hayData_tipos = true;
                    ctrl.cargando_tipos = false;
                    ctrl.grid_option_requisito.data = response.data;
                  }

                });
        };

        ctrl.update_config = function() {
            ctrl.requisito_tipo_avance = {};
            ctrl.hay_requisitos_conf = true;
            ctrl.cargando_requisitos = true;
            financieraRequest.get("requisito_avance", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.requisito_select = [];
                    ctrl.requisito_avance = response.data;
                    financieraRequest.get("requisito_tipo_avance", $.param({
                            query: "TipoAvance.Id:" + ctrl.row_entity.Id,
                            limit: -1,
                            sortby: "Id",
                            order: "asc"
                        }))
                        .then(function(response) {

                            if(typeof(response.data) !== "string"){

                              ctrl.hay_requisitos_conf = true;
                              ctrl.cargando_requisitos = false;
                              ctrl.grid_option_requisito.data = response.data;

                              ctrl.requisito_tipo_avance = response.data;
                              angular.forEach(ctrl.requisito_avance, function(ra) {
                                  var distint = 0;
                                  angular.forEach(ctrl.requisito_tipo_avance, function(rta) {
                                      if (rta.RequisitoAvance.Id === ra.Id) {
                                          distint++;
                                      }
                                  });
                                  if (distint === 0) {
                                      ctrl.requisito_select.push(ra);
                                  }
                              });
                          }else{

                            ctrl.hay_requisitos_conf = false;
                            ctrl.cargando_requisitos = false;
                          }
                        });
                });
        };
        ctrl.get_all_avances();
        ctrl.get_all_requisitos();

        ctrl.anadir_requisito = function() {
            var data = {
                TipoAvance: {
                    Id: parseInt(ctrl.row_entity.Id)
                },
                RequisitoAvance: {
                    Id: parseInt(ctrl.requisito)
                }
            };
            console.log(data);
            financieraRequest.post("requisito_tipo_avance", data)
                .then(function(info) {
                    console.log(info);
                    ctrl.update_config();
                });
        };

        ctrl.eliminar_requisito = function(id) {
            financieraRequest.delete("requisito_tipo_avance", id)
                .then(function(info) {
                    console.log(info);
                    ctrl.update_config();
                });
        };

        $scope.loadrow = function(row, operacion) {
            ctrl.operacion = operacion;
            switch (operacion) {
                case "ver":
                    ctrl.row_entity = row.entity;
                    console.log(ctrl.row_entity);
                    ctrl.get_requisito_tipo_avance(ctrl.row_entity.Id);
                    $('#modalVer').modal('show');
                    break;
                case "add":
                    ctrl.tipo_avance.CodigoAbreviacion = "";
                    ctrl.tipo_avance.Nombre = "";
                    ctrl.tipo_avance.Descripcion = "";
                    $('#myModal').modal('show');
                    break;
                case "edit":
                    ctrl.row_entity = row.entity;
                    ctrl.tipo_avance.CodigoAbreviacion = ctrl.row_entity.CodigoAbreviacion;
                    ctrl.tipo_avance.Nombre = ctrl.row_entity.Nombre;
                    ctrl.tipo_avance.Descripcion = ctrl.row_entity.Descripcion;
                    ctrl.tipo_avance.Activo = ctrl.row_entity.Activo;
                    ctrl.tipo_avance.FechaRegistro = ctrl.row_entity.FechaRegistro;
                    console.log(ctrl.tipo_avance);
                    $('#myModal').modal('show');
                    break;
                case "delete":
                    ctrl.row_entity = row.entity;
                    ctrl.delete_tipo();
                    break;
                case "config":
                    ctrl.row_entity = row.entity;
                    ctrl.update_config();
                    $('#modalConf').modal('show');
                    break;
                default:
            }
        };

        ctrl.delete_tipo = function() {
            swal({
                title:$translate.instant('BTN.CONFIRMAR') ,
                text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.CodigoAbreviacion,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('BTN.BORRAR'),
                cancelButtonText: $translate.instant('BTN.CANCELAR')
            }).then(function() {
                financieraRequest.delete("tipo_avance", ctrl.row_entity.Id)
                    .then(function(response) {
                        if (response.status === 200) {
                            swal(
                                $translate.instant('ELIMINADO'),
                                ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ELIMINADO'),
                                'success'
                            );
                            ctrl.get_all_avances();
                        }
                    });
            });
        };

        ctrl.validateFields = function(){


          if($scope.avances_add_edit.$invalid){
            angular.forEach($scope.avances_add_edit.$error,function(controles,error){
              angular.forEach(controles,function(control){
                control.$setDirty();
              });
            });

            swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
            return false;

          }

        }

        ctrl.add_edit = function() {
            var data = {};
            var validar_campos = ctrl.validateFields();

            if(validar_campos != false){
            switch (ctrl.operacion) {
                case 'edit':
                    data = {
                        Id: ctrl.row_entity.Id,
                        CodigoAbreviacion: ctrl.tipo_avance.CodigoAbreviacion,
                        Nombre: ctrl.tipo_avance.Nombre,
                        Descripcion: ctrl.tipo_avance.Descripcion,
                        Activo: ctrl.tipo_avance.Activo,
                        FechaRegistro: ctrl.tipo_avance.FechaRegistro,
                    };

                    financieraRequest.put("tipo_avance", data.Id, data)
                        .then(function(response) {
                            if (response.status === 200) {
                                swal(
                                    $translate.instant('ACTUALIZADO'),
                                    ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                                    'success'
                                );
                                ctrl.tipo_avance = {};
                                $("#myModal").modal('hide');
                                ctrl.get_all_avances();
                            }else{
                              swal("Error", $translate.instant("E_0459"),"error");
                              ctrl.tipo_avance = {};
                              $("#myModal").modal('hide');
                              ctrl.get_all_avances();
                            }
                        });
                    break;
                case 'add':
                    data = {
                        CodigoAbreviacion: ctrl.tipo_avance.CodigoAbreviacion,
                        Nombre: ctrl.tipo_avance.Nombre,
                        Descripcion: ctrl.tipo_avance.Descripcion,
                        Activo: true
                    };
                    financieraRequest.post("tipo_avance", data)
                        .then(function(info) {
                            if (info.status === 201) {

                              var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CODIGO_ABREVIACION') + "</th><th>" + $translate.instant('NOMBRE') + "</th><th>" + $translate.instant('DESCRIPCION') + "</th>";
                              templateAlert = templateAlert + "<tr class='success'><td>" + data.CodigoAbreviacion + "</td>" + "<td>" + data.Nombre + "</td>"+ "<td>" +  data.Descripcion + "</td></tr>" ;
                              templateAlert = templateAlert + "</table>";

                              swal($translate.instant('INFORMACION_REG_CORRECTO'), templateAlert, 'success').then(function(){
                                ctrl.tipo_avance = {};
                                $("#myModal").modal('hide');
                                ctrl.get_all_avances();
                              });

                          }else{
                            swal("Error", $translate.instant("E_0459"),"error");
                            ctrl.tipo_avance = {};
                            $("#myModal").modal('hide');
                            ctrl.get_all_avances();
                          }

                        });

                    break;
                default:
            }

          }
        };

        ctrl.reset = function (){
          ctrl.tipo_avance.CodigoAbreviacion = "";
          ctrl.tipo_avance.Nombre = "";
          ctrl.tipo_avance.Descripcion = "";

        };
    });
