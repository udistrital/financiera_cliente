'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ConceptosListadoTipoTransaccionCtrl
 * @description
 * # ConceptosListadoTipoTransaccionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ConceptosListadoTipoTransaccionCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    ctrl.tipoTr = {};
    ctrl.tipoTr.FechaInicio = new Date();
    ctrl.tipoTr.FechaFin = new Date();
    ctrl.tipoTransaccion = {
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
          displayName: 'Id',
          visible: false
        },
        {
          field: 'NumeroTraslado',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Fecha',
          displayName: $translate.instant('CLASE'),
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
      console.log(request);
    }

  });
