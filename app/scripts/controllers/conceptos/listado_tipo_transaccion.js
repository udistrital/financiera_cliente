'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ConceptosListadoTipoTransaccionCtrl
 * @description
 * # ConceptosListadoTipoTransaccionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ConceptosListadoTipoTransaccionCtrl', function ($scope,$translate,financieraRequest,financieraMidRequest,gridApiService) {
    var ctrl = this;
    ctrl.tipoTr = {};
    ctrl.tipoTr.FechaInicio = new Date();
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    ctrl.tipoTr.FechaFin = new Date();
    ctrl.tipoTransaccion = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: true,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          displayName: 'Id',
          visible: false
        },
        {
          field: 'DetalleTipoTransaccion.Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'DetalleTipoTransaccion.Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'DetalleTipoTransaccion.ClaseTransaccion.Nombre',
          displayName: $translate.instant('CLASE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row.entity"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiTipoTransaccion = gridApi;
        ctrl.gridApiTipoTransaccion = gridApiService.pagination(gridApi,ctrl.consultarListadoTr,$scope);
      }
    };

    ctrl.versiones = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      selectionRowHeaderWidth: 35,
      enableVerticalScrollbar: 0,
      useExternalPagination: true,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          displayName: 'Id',
          visible: false
        },
        {
          field: 'DetalleTipoTransaccion.Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'DetalleTipoTransaccion.Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'DetalleTipoTransaccion.ClaseTransaccion.Nombre',
          displayName: $translate.instant('CLASE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        },
        {
          field: 'Version.NumeroVersion',
          displayName: $translate.instant('VERSION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        },
        {
          field: 'Version.Definitiva',
          displayName: $translate.instant('DEFINITIVA'),
          cellTemplate: '<div class="middle"><md-checkbox aria-label="activo" ng-disabled="true" ng-model="row.entity.Version.Definitiva" class="blue"></md-checkbox></div>',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        }
      ]
    };

    ctrl.versiones.onRegisterApi =  function(gridApi) {
      ctrl.gridApiVersiones = gridApi;
      ctrl.gridApiVersiones = gridApiService.pagination(gridApi,ctrl.consultarListadoTr,$scope);
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
           if(row.isSelected === false){
             ctrl.versionSelec = undefined;
           }else{
             ctrl.versionSelec = angular.copy(row.entity);
             ctrl.versionDefinitiva = ctrl.versionSelec.Version.Definitiva;
           }
           console.log(ctrl.versionSelec);
           ctrl.versionSelec.Version.FechaFin = new Date(ctrl.versionSelec.Version.FechaFin);
           ctrl.versionSelec.Version.FechaInicio = new Date(ctrl.versionSelec.Version.FechaInicio);
      });
    }


    ctrl.abrirModal=function(modal){
      $('#'+modal).modal();
    }
    ctrl.obtenerListas=function(){
      financieraRequest.get("tipo_concepto").then(function(response) {
        ctrl.tipoConceptoTesoral = response.data;
      });
    }
    ctrl.obtenerListas();
    ctrl.registrar = function(){
      if(!ctrl.crearVersion){
        financieraMidRequest.post("tipo_transaccion/",request).then(function(response){
          console.log(response);
          var templateAlert;
          if(response.data.Type === "success"){
            templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.tipo_transaccion_version.Body.TipoTransaccion + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>"
            templateAlert = templateAlert + "</table>";
          }else{
            templateAlert=$translate.instant(response.data.Code);
          }
            swal('',templateAlert,response.data.Type).then(function(){
              if(response.data.Type === "success"){
                $('#modalCrear').modal('hide');
                ctrl.consultarListadoTr(0,'NumeroVersion:1');
              }
            });
        });
      }
      var request={};
      var matches;
      request.detalleTransaccion = ctrl.tipoTr;
      matches = request.detalleTransaccion.Nombre.match(/\b(\w)/g);
      request.CodigoAbreviacion =  matches.join('') + request.detalleTransaccion.Nombre.slice(-1);
      request.version = {
        FechaInicio:ctrl.tipoTr.FechaInicio,
        FechaFin:ctrl.tipoTr.FechaFin,
        NumeroVersion:1,
        Descripcion:"Version Inicial"
      };


    }

    ctrl.consultarListadoTr = function(offset,query){
      financieraMidRequest.get('tipo_transaccion/GetTipoTransaccionByVersion',$.param({
        limit: ctrl.tipoTransaccion.paginationPageSize,
        offset:offset,
        query:query,
        sortby:"Id",
        order:"asc"
      })).then(function(response){
        response.data;
        if(response.data != null){
        ctrl.tipoTransaccion.data = response.data.TipoTransaccion;
        ctrl.tipoTransaccion.totalItems = response.data.RegCuantity;
        }
      });
    }

    ctrl.consultarListadoTr(0,'NumeroVersion:1');


    $scope.loadrow = function(row, operacion) {
      ctrl.operacion = operacion;
      switch (operacion) {
          case "ver":
              $('#modalVer').modal();
              ctrl.consultarVersiones(0,'TipoTransaccion:'+row.DetalleTipoTransaccion.TipoTransaccionVersion.Id);
              break;
          default:
              break;
      }
    };

    ctrl.consultarVersiones = function(offset,query){
      financieraMidRequest.get('tipo_transaccion/GetTipoTransaccionByTipo',$.param({
        limit: ctrl.tipoTransaccion.paginationPageSize,
        offset:offset,
        query:query,
        sortby:"Id",
        order:"asc"
      })).then(function(response){
        response.data;
        if(response.data != null){
        ctrl.versiones.data = response.data.TipoTransaccion;
        ctrl.versiones.totalItems = response.data.RegCuantity;
        }
      });
    }

  });
