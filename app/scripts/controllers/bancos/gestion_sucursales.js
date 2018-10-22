'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SucursalesGestionSucursalesCtrl
 * @description
 * # SucursalesGestionSucursalesCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionSucursalesCtrl', function(financieraMidRequest, organizacionRequest, ubicacionesRequest,$scope, $translate, $window,uiGridConstants) {
    var ctrl = this;


    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar_sucursal', estado: true },

    ];


    ctrl.Sucursales = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Direccion',
          displayName: $translate.instant('DIRECCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Telefono',
          displayName: $translate.instant('TELEFONO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Pais',
          displayName: $translate.instant('PAIS'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Departamento',
          displayName: $translate.instant('DEPARTAMENTO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Ciudad',
          displayName: $translate.instant('CIUDAD'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ]
    };

    ctrl.Sucursales.multiSelect = false;
    ctrl.Sucursales.modifierKeysToMultiSelect = false;
    ctrl.Sucursales.enablePaginationControls = true;
    ctrl.Sucursales.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    financieraMidRequest.get('gestion_sucursales/listar_sucursales','').then(function(response) {
      if (response.data == null) {
          //PONER MARCA DE AGUA DE QUE NO HAY
      } else {
          ctrl.Sucursales.data = response.data;
      }


    });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "editar_sucursal":
                  ctrl.mostrar_modal_edicion_sucursal(row);
                break;
            case "otro":
                break;
          default:
        }
    };

    ctrl.mostrar_modal_edicion_sucursal = function(row){
        $("#modal_editar_sucursal").modal("show");
    };

    ctrl.mostrar_modal_agregar_sucursal = function(row){

      ubicacionesRequest.get('lugar', $.param({
          limit: -1,
          query: "TipoLugar.CodigoAbreviacion:PAIS",
        })).then(function(response) {
          ctrl.Paises = response.data;
        });

        ubicacionesRequest.get('lugar', $.param({
            limit: -1,
            query: "TipoLugar.CodigoAbreviacion:DEPARTAMENTO",
          })).then(function(response) {
            ctrl.Departamentos = response.data;
          });

          ubicacionesRequest.get('lugar', $.param({
              limit: -1,
              query: "TipoLugar.CodigoAbreviacion:CIUDAD",
            })).then(function(response) {
              ctrl.Ciudades = response.data;
            });

        $("#modal_agregar_sucursal").modal("show");


    };

    ctrl.agregar_sucursal = function(row){

      if(ctrl.NombreSucursal && ctrl.Telefono && ctrl.Direccion && ctrl.selectPaises && ctrl.selectDepartamento && ctrl.selectCiudad){

      var objeto_paises = JSON.parse(ctrl.selectPaises)
      var objeto_departamentos = JSON.parse(ctrl.selectDepartamento)
      var objeto_ciudades = JSON.parse(ctrl.selectCiudad)

      var informacion_sucursal = {
        Nombre       : ctrl.NombreSucursal,
        Direccion     :ctrl.Direccion,
        Telefono     : ctrl.Telefono.toString(),
        Pais          : objeto_paises.Id.toString(),
        Departamento  : objeto_departamentos.Id.toString(),
        Ciudad        : objeto_ciudades.Id.toString(),
      }

      financieraMidRequest.post('gestion_sucursales/insertar_sucursal', informacion_sucursal).then(function(response) {

          if (typeof(response.data) == "object") {
              swal({
                  html: $translate.instant('INFORMACION_REG_CORRECTO'),
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#449D44",
                  confirmButtonText: $translate.instant('VOLVER'),
              }).then(function() {
                  $('#modal_agregar_sucursal').modal('hide');
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


              })

          }
      });

    }else {
                swal({
                    html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#449D44",
                    confirmButtonText: $translate.instant('VOLVER'),
                })
            }
    };

    ctrl.editar_sucursal = function(row){
          //alert("editar sucursal");
    };

  });
