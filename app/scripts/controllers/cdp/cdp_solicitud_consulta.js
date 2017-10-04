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
  .controller('CdpCdpSolicitudConsultaCtrl', function ($scope,argoRequest,solicitud_disponibilidad,financieraRequest,financieraMidRequest, $translate) {
    var self = this;
    self.alerta = "";
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    self.gridOptions = {
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering : true,
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
      onRegisterApi : function( gridApi ) {
        self.gridApi = gridApi;
      }

    };
    //cargar datos de las Solicitudes
    financieraMidRequest.get('disponibilidad/Solicitudes','limit=0&query=Expedida:false&sortby=Id&order=desc').then(function(response) {
      self.gridOptions.data.length = 0;
      self.gridOptions.data = response.data;


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


    self.cragarDatos = function(){
    	financieraMidRequest.get('disponibilidad/Solicitudes','limit=0&query=Expedida:false&sortby=Id&order=desc').then(function(response) {
        self.gridOptions.data.length = 0;
        self.gridOptions.data = response.data;
  
  
      });
    };
    //-------------------------------
    self.limpiar_alertas= function(){
      self.alerta_registro_cdp = "";
    };

    //funcion para actualizar grid
    self.actualiza_solicitudes = function () {
      financieraMidRequest.get('disponibilidad/Solicitudes','limit=0&query=Expedida:false&sortby=Id&order=desc').then(function(response) {
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
                  self.cragarDatos();
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

                     self.actualiza_solicitudes();
                 });
               }

             }

           });

       });
     };


  });
