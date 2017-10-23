'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpSolicitudConsultaCtrl
 * @description
 * # CdpCdpSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("solicitud_disponibilidad",function(){
        return {};
  })
  .controller('CdpCdpSolicitudConsultaCtrl', function ($scope,$filter,argoRequest,solicitud_disponibilidad,financieraRequest,financieraMidRequest, $translate) {
    var self = this;
    self.alerta = "";
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    self.gridOptions = {
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering : true,
      paginationPageSizes: [20, 50, 100],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs : [
        {field: 'SolicitudDisponibilidad.Id',             visible : false},
        {field: 'SolicitudDisponibilidad.Numero',  displayName: $translate.instant("NO"), cellClass: 'input_center',headerCellClass: 'text-info' },
        {field: 'DependenciaSolicitante.Nombre',  displayName: $translate.instant("DEPENDENCIA_SOLICITANTE"),headerCellClass: 'text-info'},
        {field: 'DependenciaDestino.Nombre',  displayName: $translate.instant("DEPENDENCIA_DESTINO"),headerCellClass: 'text-info'},
        {field: 'SolicitudDisponibilidad.Vigencia', displayName: $translate.instant("VIGENCIA"), cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'SolicitudDisponibilidad.FechaSolicitud',  displayName: $translate.instant("FECHA_REGISTRO") , cellClass: 'input_center', cellTemplate: '<span>{{row.entity.SolicitudDisponibilidad.FechaSolicitud | date:"yyyy-MM-dd":"UTF"}}</span>', headerCellClass: 'text-info'},
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '6%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'text-info'
      }
      ],
      onRegisterApi : function( gridApi ){
        gridApi.core.on.filterChanged($scope, function() {
          var grid = this.grid;
          angular.forEach(grid.columns, function(value, key) {
              if(value.filters[0].term) {
                  //console.log('FILTER TERM FOR ' + value.colDef.name + ' = ' + value.filters[0].term);
              }
          });
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          console.log('newPage '+newPage+' pageSize '+pageSize);
          self.gridOptions.data = {};
          var offset = (newPage-1)*pageSize;
          self.cragarDatos(offset,query);
        });
        }

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
      self.Vigencia = self.vigenciaActual;
      self.gridOptions.totalItems = 5000;
      self.cragarDatos(0,'');   
    });
   
    
    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
          case "ver":
          $("#myModal").modal();
          $scope.apropiacion= undefined;
            $scope.apropiaciones = [];
            self.data = null;
            self.data = row.entity;
            console.log(self.data);
          argoRequest.get('fuente_financiacion_rubro_necesidad','query=Necesidad.Id:'+self.data.SolicitudDisponibilidad.Necesidad.Id).then(function(response) {
  
            angular.forEach(response.data, function(data){
              if($scope.apropiaciones.indexOf(data.Apropiacion) !== -1) {
  
              }else{
                $scope.apropiaciones.push(data.Apropiacion);
              }
              });
          });
              break;
          default:
      }
  };


    self.cragarDatos = function(offset,query){
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined) {
        financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
          UnidadEjecutora: self.UnidadEjecutora,
          rangoinicio: inicio,
          rangofin: fin,
          offset: offset
        })).then(function(response) {
        if (response.data === null){
          self.gridOptions.data = [];
        }else{
          self.gridOptions.data = response.data;
        }
  
  
        });
      }else{
        financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
          UnidadEjecutora: self.UnidadEjecutora,
          offset: offset
        })).then(function(response) {
        if (response.data === null){
          self.gridOptions.data = [];
        }else{
          self.gridOptions.data = response.data;
        }
        
  
  
        });
      }
          
    	
    };

    //-------------------------------
    self.limpiar_alertas= function(){
      self.alerta_registro_cdp = "";
    };

    //funcion para actualizar grid
    self.actualiza_solicitudes = function () {
      financieraMidRequest.get('disponibilidad/Solicitudes/'+self.Vigencia,$.param({
          UnidadEjecutora: self.UnidadEjecutora
        })).then(function(response) {
        self.gridOptions.data.length = 0;
        self.gridOptions.data = response.data;
  
  
      });
      };
    //----------------------------

    //generar la disponibilidad (peticion al mid api)
    self.generar_disponibilidad = function(){
      var arrSolicitudes = [];
      self.data.Responsable = 876543216;
      self.data.Afectacion = $scope.afectacion[0];
      arrSolicitudes[0] = self.data;
      console.log("########################");
      console.log(arrSolicitudes);
      console.log("########################");
        financieraMidRequest.post('disponibilidad/ExpedirDisponibilidad', arrSolicitudes).then(function(response){
          console.log(response.data);
            if (response.data[0].Type !== undefined){
              if (response.data[0].Type === "error"){
                swal('',$translate.instant(response.data[0].Code),response.data[0].Type);
              }else{
                swal('',$translate.instant(response.data[0].Code)+" "+response.data[0].Body.NumeroDisponibilidad,response.data[0].Type).then(function(){
                  $("#myModal").modal('hide');
                });
              }

            }
          //alert(data);
          });
    };
    self.gridOptions.multiSelect = false;
  
     //-----------------------------

     self.Rechazar = function (){
       var solicitud = self.gridApi.selection.getSelectedRows();
       $("#myModal").modal('hide');
       swal({
         title: 'Indique una justificación por el rechazo',
         input: 'textarea',
         showCancelButton: true,
         inputValidator: function (value) {
           return new Promise(function (resolve, reject) {
             if (value) {
               resolve();
             } else {
               reject('Por favor indica una justificación!');
             }
           });
         }
       }).then(function(text) {
         console.log(text);
         solicitud[0].SolicitudDisponibilidad.JustificacionRechazo = text;
         console.log(solicitud[0].SolicitudDisponibilidad);
         var sl = solicitud[0].SolicitudDisponibilidad;
           argoRequest.put('solicitud_disponibilidad/', sl.Id , sl).then(function(response) {
             console.log(response.data);
             self.actualiza_solicitudes();
             if (response.data.Type !== undefined) {
               if (response.data.Type === "error") {
                 swal('', $translate.instant(response.data.Code), response.data.Type);
                   self.actualiza_solicitudes();
               } else {
                 swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {

                     
                 });
               }

             }

           });

       });
     };

     $scope.$watch("cdpSolicitudConsulta.Vigencia", function() {
      
       
        self.cragarDatos(0,'');
    
      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
        //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
        console.log("reset fecha inicio");
        self.fechaInicio = undefined;
        self.fechaFin = undefined;
      }
      self.fechamin = new Date(
        self.Vigencia,
        0, 1
      );
      self.fechamax = new Date(
        self.Vigencia,
        12, 0
      );
    }, true);


  });
