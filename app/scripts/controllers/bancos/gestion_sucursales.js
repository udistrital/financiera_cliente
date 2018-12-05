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
    };

    ctrl.cargarSucursales = function(){
      financieraMidRequest.get('gestion_sucursales/listar_sucursales',null).then(function(response) {
            ctrl.Sucursales.data = response.data;
      });
    }
    ctrl.cargarSucursales();

     ctrl.cargarUbicaciones = function(){
       ubicacionesRequest.get('lugar', $.param({
           limit: -1,
           query: "TipoLugar.NumeroOrden:1",
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
       ctrl.request  = angular.copy(row.entity);
       ctrl.PaisEd =   ctrl.request.Pais;
       ctrl.DepartamentoEd = ctrl.request.Departamento;
       ctrl.CiudadEd = ctrl.request.Ciudad;
        $("#modal_editar_sucursal").modal("show");
    };

    ctrl.mostrar_modal_agregar_sucursal = function(row){
        $("#modal_agregar_sucursal").modal("show");
    };

    ctrl.reInitCrear = function() {
      $scope.formCrearSuc.$setPristine();
      ctrl.sucursalCr = {};
    }

    ctrl.agregar_sucursal = function(row){
      var templateAlert;
      financieraMidRequest.post('gestion_sucursales/insertar_sucursal', ctrl.sucursalCr).then(function(response) {
        console.log(response.data);
          if(response.data.Type === "success"){
            templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NOMBRE') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Nombre + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>"
            templateAlert = templateAlert + "</table>";
          }else{
            templateAlert=$translate.instant(response.data.Code);
          }
            swal('',templateAlert,response.data.Type).then(function(){
              if(response.data.Type === "success"){
                $('#modal_agregar_sucursal').modal('hide');
                ctrl.cargarSucursales();
                ctrl.reInitCrear();
              }
            });
      });
    }

    ctrl.reinitEditar = function(){
      $scope.formEditarSuc.$setPristine();
    }

    ctrl.editar_sucursal = function(){

      if(ctrl.request.Pais === null){
        if (!angular.isUndefined(ctrl.PaisEd) && ctrl.PaisEd != null){
          ctrl.request.Pais = {
            Lugar:ctrl.PaisEd.Id
          }
        }
      }else{

        if(!angular.isUndefined(ctrl.PaisEd) && ctrl.PaisEd != null){
          ctrl.request.Pais.UbicacionEnte.Lugar = ctrl.PaisEd.Id;
          ctrl.request.Pais = ctrl.request.Pais.UbicacionEnte;
        }
      }

      if(ctrl.request.Departamento === null){
        if (!angular.isUndefined(ctrl.DepartamentoEd) && ctrl.DepartamentoEd != null){
          ctrl.request.Departamento = {
            Lugar:ctrl.DepartamentoEd.Id
          }
        }
      }else{
        if(!angular.isUndefined(ctrl.DepartamentoEd) && ctrl.DepartamentoEd != null){
          ctrl.request.Departamento.UbicacionEnte.Lugar = ctrl.DepartamentoEd.Id;
          ctrl.request.Departamento = ctrl.request.Departamento.UbicacionEnte;
        }
      }

      if(ctrl.request.Ciudad === null){
        if (!angular.isUndefined(ctrl.CiudadEd) && ctrl.CiudadEd != null){
          ctrl.request.Ciudad = {
            Lugar:ctrl.CiudadEd.Id
          }
        }
      }else{
        if(!angular.isUndefined(ctrl.CiudadEd) && ctrl.CiudadEd != null){
          ctrl.request.Ciudad.UbicacionEnte.Lugar = ctrl.CiudadEd.Id;
          ctrl.request.Ciudad = ctrl.request.Ciudad.UbicacionEnte;
        }
      }

      financieraMidRequest.put('gestion_sucursales/EditarSucursal',ctrl.request.Organizacion.Ente,ctrl.request).then(function(response){
        if(response.data != null){
          swal({
              html: $translate.instant(response.data.Code),
              type: response.data.Type,
          }).then(function() {
            if (response.data.Type==="success"){
                $("#modal_editar_sucursal").modal("hide");
                ctrl.cargarSucursales();
                ctrl.reinitEditar();
            }
        })
        }

      });
    }
  });
