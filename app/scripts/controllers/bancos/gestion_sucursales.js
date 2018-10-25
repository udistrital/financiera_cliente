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

    ctrl.sucursalCr = {};
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
        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row.entity"></btn-registro><center>',
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
     ctrl.cargarUbicaciones = function(){
       ubicacionesRequest.get('lugar', $.param({
           limit: -1,
           query: "TipoLugar.NumeroOrden:0",
         })).then(function(response) {
           ctrl.Paises = response.data;
         });

         ubicacionesRequest.get('lugar', $.param({
             limit: -1,
             query: "TipoLugar.NumeroOrden:2",
           })).then(function(response) {
             ctrl.Departamentos = response.data;
           });

           ubicacionesRequest.get('lugar', $.param({
               limit: -1,
               query: "TipoLugar.NumeroOrden:3",
             })).then(function(response) {
               ctrl.Ciudades = response.data;
             });
     }
     ctrl.cargarUbicaciones();

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        ctrl.sucursal = row;
        switch (operacion) {
            case "editar_sucursal":
                  ctrl.mostrar_modal_edicion_sucursal();
                break;
            case "otro":
                break;
          default:
        }
    };

    ctrl.mostrar_modal_edicion_sucursal = function(){
       ctrl.PaisEd =   ctrl.sucursal.Pais;
       ctrl.DepartamentoEd = ctrl.sucursal.Departamento;
       ctrl.CiudadEd = ctrl.sucursal.Ciudad;
        $("#modal_editar_sucursal").modal("show");
    };

    ctrl.mostrar_modal_agregar_sucursal = function(row){
        $("#modal_agregar_sucursal").modal("show");
    };

    ctrl.agregar_sucursal = function(row){

      if(ctrl.NombreSucursal && ctrl.Telefono && ctrl.Direccion && ctrl.selectPaises && ctrl.selectDepartamento && ctrl.selectCiudad){

      var objeto_paises = ctrl.PaisEd
      var objeto_departamentos = ctrl.DepartamentoEd
      var objeto_ciudades = ctrl.CiudadEd

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

    ctrl.editar_sucursal = function(){
      console.log(ctrl.sucursal);
      if(ctrl.sucursal.Pais === null){
        if (!angular.isUndefined(ctrl.PaisEd) && ctrl.PaisEd != null){
          ctrl.sucursal.Pais = {
            Lugar:ctrl.PaisEd.Id
          }
        }
      }else{
        if(!angular.isUndefined(ctrl.PaisEd) && ctrl.PaisEd != null){
          ctrl.sucursal.Pais.UbicacionEnte.Lugar = ctrl.PaisEd.Id;
          ctrl.sucursal.Pais = ctrl.sucursal.Pais.UbicacionEnte;
        }
      }

      if(ctrl.sucursal.Departamento === null){
        if (!angular.isUndefined(ctrl.DepartamentoEd) && ctrl.DepartamentoEd != null){
          ctrl.sucursal.Departamento = {
            Lugar:ctrl.DepartamentoEd.Id
          }
        }
      }else{
        if(!angular.isUndefined(ctrl.DepartamentoEd) && ctrl.DepartamentoEd != null){
          ctrl.sucursal.Departamento.UbicacionEnte.Lugar = ctrl.DepartamentoEd.Id;
          ctrl.sucursal.Departamento = ctrl.sucursal.Departamento.UbicacionEnte;
        }
      }


      if(ctrl.sucursal.Ciudad === null){
        if (!angular.isUndefined(ctrl.CiudadEd) && ctrl.CiudadEd != null){
          ctrl.sucursal.Ciudad = {
            Lugar:ctrl.CiudadEd.Id
          }
        }
      }else{
        if(!angular.isUndefined(ctrl.CiudadEd) && ctrl.CiudadEd != null){
          ctrl.sucursal.Ciudad.UbicacionEnte.Lugar = ctrl.CiudadEd.Id;
          ctrl.sucursal.Ciudad = ctrl.sucursal.Ciudad.UbicacionEnte;
        }
      }
      financieraMidRequest.put('gestion_sucursales/EditarSucursal',ctrl.sucursal.Organizacion.Ente,ctrl.sucursal).then(function(response){
        console.log(response);
      })
    };

  });
