'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PacCierrePeriodoCtrl
 * @description
 * # PacCierrePeriodoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearTipoComprobanteCtrl', function ($scope, $translate,financieraMidRequest,financieraRequest, $window) {
  	var ctrl = this;

    $scope.botones_activo = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      { clase_color: "borrar", clase_css: "fa fa-times-circle fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.INACTIVAR'), operacion: 'inactive', estado: true }
    ];

    $scope.botones_inactivo = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
      { clase_color: "add", clase_css: "fa fa-plus fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.ACTIVAR'), operacion: 'active', estado: true }
    ];


    ctrl.TipoComprobantes = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 10,
        useExternalPagination: true,

        columnDefs: [
            { field: 'Id', visible: false },
            { field: 'CodigoAbreviacion',displayName: $translate.instant('CODIGO'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Nombre',displayName: $translate.instant('NOMBRE'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Descripcion',displayName: $translate.instant('DESCRIPCION'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Activo',displayName: $translate.instant('ESTADO'), cellClass: 'input_center', headerCellClass: 'text-info',cellFilter: "filtro_estado_comprobante:row.entity" },
            { field: 'UnidadEjecutora',displayName: $translate.instant('UNIDAD_EJECUTORA'), cellClass: 'input_center', headerCellClass: 'text-info' },
            { field: 'Entidad',displayName: $translate.instant('ENTIDAD'), cellClass: 'input_center', headerCellClass: 'text-info' },
            {
                field: 'Acciones',
                cellClass: 'input_center',
                headerCellClass: 'text-info',
                displayName: $translate.instant('ACCIONES'),
                cellTemplate: '<center><a ng-if="row.entity.Activo==true"> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_activo" fila="row"></btn-registro><center></a>'+
                '<center><a ng-if="row.entity.Activo==false"> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_inactivo" fila="row"></btn-registro><center></a>'
            }
            ]
    };

    ctrl.TipoComprobantes.multiSelect = false;

    financieraRequest.get('tipo_comprobante','').then(function(response) {
      ctrl.TipoComprobantes.data = response.data;
    });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;

          switch (operacion) {
              case "edit":
                  $scope.llenar_modal(row);
                  $('#modal_edicion').modal('show');
                  break;
              case "inactive":
                  $scope.inactivar(row);
                  break;
              case "active":
                  $scope.activar(row);
                  break;
              default:
          }


    };

    ctrl.abrirModalCreacion = function (){
      $('#modal_creacion').modal('show');
    };

    ctrl.crearNuevoComprobante = function (){
      var nuevo_comprobante = {
        Nombre : ctrl.NombreNuevo,
        Descripcion: ctrl.DescripcionNuevo,
        CodigoAbreviacion: ctrl.CodigoNuevo,
        Activo:  Boolean("true"),
        UnidadEjecutora: parseInt(ctrl.UnidadEjecutoraNuevo),
        Entidad: parseInt(ctrl.EntidadNuevo)
      };

      financieraRequest.post('tipo_comprobante', nuevo_comprobante).then(function(response) {
            console.log(response.data)
            if (typeof(response.data) == "object") {
              swal({
                  html: "Comprobante creado correctamente",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#449D44",
                  confirmButtonText: $translate.instant('VOLVER'),
              }).then(function() {
                  $('#modal_edicion').modal('hide');
                  $window.location.reload()
              })
          } else {
              swal({
                  html: "Error al crear comprobante",
                  type: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#449D44",
                  confirmButtonText: $translate.instant('VOLVER'),
              }).then(function() {
                  $('#modal_creacion').modal('hide');
                  $window.location.reload()
              })
          }
      });
    };

    $scope.llenar_modal = function(row) {
        ctrl.id_edicion = row.entity.Id
        ctrl.nombre_comprobante_edicion = row.entity.Nombre
        ctrl.descripcion_comprobante_edicion = row.entity.Descripcion
        ctrl.codigo_comprobante_edicion = row.entity.CodigoAbreviacion
        ctrl.activo_edicion = row.entity.Activo
        ctrl.unidad_ejecutora_edicion = row.entity.UnidadEjecutora
        ctrl.entidad_edicion = row.entity.Entidad


    };

    ctrl.actualizarComprobante = function(row) {

        if (ctrl.nombre_comprobante_edicion && ctrl.descripcion_comprobante_edicion && ctrl.codigo_comprobante_edicion && ctrl.unidad_ejecutora_edicion && ctrl.entidad_edicion) {
            var objeto_unidad_ejecutora = JSON.parse(ctrl.unidad_ejecutora_edicion);
            var objeto_entidad_edicion = JSON.parse(ctrl.entidad_edicion);

            swal({
                html: $translate.instant('CONFIRMACION_EDICION') +
                    "<br><b>" + $translate.instant('NOMBRE') + ":</b> " + ctrl.nombre_comprobante_edicion +
                    "<br><b>" + $translate.instant('DESCRIPCION') + ":</b> " + ctrl.descripcion_comprobante_edicion +
                    "<br><b>" + $translate.instant('CODIGO') + ":</b> " + ctrl.codigo_comprobante_edicion + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#449D44",
                cancelButtonColor: "#C9302C",
                confirmButtonText: $translate.instant('CONFIRMAR'),
                cancelButtonText: $translate.instant('CANCELAR'),
            }).then(function() {

              var comprobante_edicion = {
                Id: ctrl.id_edicion,
                Nombre : ctrl.nombre_comprobante_edicion,
                Descripcion:   ctrl.descripcion_comprobante_edicion,
                CodigoAbreviacion:  ctrl.codigo_comprobante_edicion,
                Activo: ctrl.activo_edicion,
                UnidadEjecutora : parseInt(ctrl.unidad_ejecutora_edicion),
                Entidad: parseInt(ctrl.entidad_edicion)
              };

                financieraRequest.put('tipo_comprobante', comprobante_edicion.Id, comprobante_edicion).then(function(response) {

                    if (response.data == "OK") {
                        swal({
                            html: "Actualizado correctamente",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#449D44",
                            confirmButtonText: $translate.instant('VOLVER'),
                        }).then(function() {
                            $('#modal_edicion').modal('hide');
                            $window.location.reload()
                        })
                    } else {
                        swal({
                            html: "Error al actualizar",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#449D44",
                            confirmButtonText: $translate.instant('VOLVER'),
                        }).then(function() {
                            $('#modal_edicion').modal('hide');
                            $window.location.reload()
                        })
                    }
                });

            }, function(dismiss) {
                if (dismiss === 'cancel') {

                    $('#modal_edicion').modal('hide');
                    // $window.location.reload()
                }
            })
        } else {
            swal({
                html: "Llenar todos los campos",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#449D44",
                confirmButtonText: $translate.instant('VOLVER'),
            })
        }
    };

  }).filter('filtro_estado_comprobante', function($filter) {
        return function(input, entity) {
            var output;
            if (undefined === input || null === input) {
                return "";
            }

            if (entity.Activo === true) {
                output = "Activo";
            }

            if (entity.Activo === false) {
                output = "Inactivo";
            }


            return output;
        };
    });;