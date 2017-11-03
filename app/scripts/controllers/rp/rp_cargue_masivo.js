'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpCargueMasivoCtrl
 * @description
 * # RpRpCargueMasivoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RpRpCargueMasivoCtrl', function ($scope, $filter, $translate, $window, financieraMidRequest, argoRequest, financieraRequest, oikosRequest) {
    var self = this;
    self.aprovarMasivo = false;
    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
       paginationPageSizes: [20, 50, 100],
      paginationPageSize: 20,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('NO'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'FechaSolicitud',
          displayName: $translate.instant('FECHA_REGISTRO'),
          headerCellClass: 'text-info',
          cellClass: 'input_center',
          cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"UTC"}}</span>'
        },
        {
          field: 'DatosDisponibilidad.NumeroDisponibilidad',
          displayName: $translate.instant('NO_CDP'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'DatosDisponibilidad.DatosNecesidad.Numero',
          displayName: $translate.instant('NECESIDAD_NO'),
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'DatosDisponibilidad.DatosNecesidad.DatosDependenciaSolicitante.Nombre',
          displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Opciones',
          cellTemplate: '<center>' +
            ' <a type="button" class="editar" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" > ' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>' +
            ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" >',
          headerCellClass: 'text-info'
        }
      ]

    };

    self.UnidadEjecutora = 1;
    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.years[0];
      self.gridOptions.totalItems = 5000;
      //self.actualizar_solicitudes(0,'');
    });
    oikosRequest.get("dependencia",$.param({
          limit: -1
        }))
    .then(function(response){
      self.Dependencias = response.data;
    });
    argoRequest.get("tipo_necesidad",$.param({
          limit: -1
        }))
    .then(function(response){
      self.tiposNecesidad = response.data;
    });
    self.cargarSolicitudesMasivas = function(){
    	var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      	var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      	var query = '';
      	if (inicio !== undefined && fin !== undefined){
        financieraMidRequest.get('registro_presupuestal/SolicitudesRpByDependencia/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          rangoinicio: inicio,
          rangofin: fin,
          offset: 0,
          idDependencia: self.Dependencia,
        })).then(function(response) {
        if (response.data.Type !== undefined){

          self.gridOptions.data = [];
        }else{
          
          self.gridOptions.data = response.data;
        }
        console.log(response.data);

      });
      }else{
        financieraMidRequest.get('registro_presupuestal/SolicitudesRpByDependencia/'+self.Vigencia, $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          offset: 0,
          idDependencia: self.Dependencia,
          tipoNecesidad: self.tipoNecesidad
        })).then(function(response) {
        if (response.data.Type !== undefined){
          self.gridOptions.data = [];
        }else{

          self.gridOptions.data = response.data;
        }
        console.log(response.data);

      });
      }
    };

  });
