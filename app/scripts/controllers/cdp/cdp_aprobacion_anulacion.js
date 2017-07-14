'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpAprobacionAnulacionCtrl
 * @description
 * # CdpCdpAprobacionAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CdpCdpAprobacionAnulacionCtrl', function ($scope,$translate,financieraRequest,financieraMidRequest,agoraRequest) {
    var self = this;
    self.rubros_afectados = [];
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Consecutivo',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('NO') },        
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('CDP_NUMERO') },
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Vigencia',   displayName: $translate.instant('VIGENCIA'), cellClass: 'input_center'},
        {field: 'FechaRegistro' , displayName : $translate.instant('FECHA_CREACION'), cellClass: 'input_center',cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'TipoAnulacion',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('TIPO') },        
        {field: 'EstadoAnulacion.Nombre', displayName : $translate.instant('ESTADO')},
        {field: 'AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DataSolicitud.DependenciaSolicitante.Nombre' , displayName : $translate.instant('DEPENDENCIA_SOLICITANTE')}
      ],
      onRegisterApi : function( gridApi ) {
        self.gridApi = gridApi;
      }
    };
    self.gridOptions.multiSelect = false;
    self.cargarListaAnulaciones = function(){
      financieraRequest.get('anulacion_disponibilidad',$.param({
        limit: -1
      })).then(function(response){
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function(data){
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Solicitud,'').then(function(response) {
            data.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data[0];
          });
        });
      });
    };

    self.cargarListaAnulaciones();

    Array.prototype.indexOfOld = Array.prototype.indexOf

    Array.prototype.indexOf = function(e, fn) {
      if (!fn) {
        return this.indexOfOld(e)
      } else {
        if (typeof fn === 'string') {
          var att = fn;
          fn = function(e) {
            return e[att];
          }
        }
        return this.map(fn).indexOfOld(e);
      }
    };

    self.formatoResumenAfectacion = function(afectacion){
      var resumen = [];
      angular.forEach(afectacion, function(data){
        var dispapr = angular.copy(data.DisponibilidadApropiacion);
        if (resumen.indexOf(dispapr.Apropiacion.Id,'Apropiacion.Id') !== -1){
          dispapr.FuenteFinanciamiento.Valor = data.Valor;
          resumen[resumen.indexOf(dispapr.Apropiacion.Id,'Apropiacion.Id')].FuenteFinanciamiento.push(dispapr.FuenteFinanciamiento)
        }else{
          if (dispapr.FuenteFinanciamiento != null || dispapr.FuenteFinanciamiento != undefined){
            var fuente = dispapr.FuenteFinanciamiento;
            fuente.Valor = data.Valor;
            dispapr.FuenteFinanciamiento = [];
            dispapr.FuenteFinanciamiento.push(fuente);
          }else{
            dispapr.Valor=data.Valor;
          }
          resumen.push(dispapr);
        }

      });
      return resumen;
    };


    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity.AnulacionDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad;
        self.anulacion = row.entity;
        self.resumen = self.formatoResumenAfectacion(self.anulacion.AnulacionDisponibilidadApropiacion);
        console.log("resumen");
        console.log(self.resumen);
        financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.cdp.Id).then(function(response) {
          self.rubros = response.data;
          angular.forEach(self.rubros, function(data){
            if($scope.apropiaciones.indexOf(data.Apropiacion.Id) !== -1) {

            }else{
              $scope.apropiaciones.push(data.Apropiacion.Id);
            }

              console.log($scope.apropiaciones);
              console.log(self.cdp.Id);
              var saldo;
              var rp = {
                Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                Apropiacion : data.Apropiacion
              };
              financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                data.Saldo  = response.data;
              });

            });

              agoraRequest.get('informacion_persona_natural',$.param({
                query: "Id:"+self.cdp.Responsable,
                limit: 1
              })).then(function(response){
                if (response.data != null){
                  self.cdp.DataResponsable = response.data[0];
                }

              });


        });
      });
    };


    self.solicitarAnulacion = function(){
      self.anulacion.EstadoAnulacion.Id = 2;
      financieraRequest.post('disponibilidad/AprobarAnulacion',self.anulacion).then(function(response){
        console.log(response.data);
        if (response.data.Type !== undefined){
          if (response.data.Type === "error"){
            swal('',$translate.instant(response.data.Code),response.data.Type);
          }else{
            swal('',$translate.instant(response.data.Code)+' '+response.data.Body.Id,response.data.Type).then(function(){
              $("#myModal").modal('hide');
              self.cargarListaAnulaciones();
            });
          }

        }
      });
    };

    self.aprobarAnulacion = function(){
      self.anulacion.EstadoAnulacion.Id = 3;
      financieraRequest.post('disponibilidad/AprobarAnulacion',self.anulacion).then(function(response){
        console.log(response.data);
        if (response.data.Type !== undefined){
          if (response.data.Type === "error"){
            swal('',$translate.instant(response.data.Code),response.data.Type);
          }else{
            swal('',$translate.instant(response.data.Code)+response.data.Body.Id,response.data.Type).then(function(){
              $("#myModal").modal('hide');
              self.cargarListaAnulaciones();
            });
          }

        }
      });
    };

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
         solicitud[0].JustificacionRechazo = text;
         solicitud[0].EstadoAnulacion.Id = 4;
         console.log(solicitud[0]);
         var sl = solicitud[0];
           financieraRequest.put('anulacion_disponibilidad/', sl.Id+"?fields=justificacion_rechazo,estado_anulacion" , sl).then(function(response) {
             console.log(response.data);
             self.cargarListaAnulaciones();
             if (response.data.Type !== undefined) {
               if (response.data.Type === "error") {
                 swal('', $translate.instant(response.data.Code), response.data.Type);
                   self.cargarListaAnulaciones();
               } else {
                 swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {

                     self.cargarListaAnulaciones();
                 });
               }

             }

           });

       });
     };



  });
