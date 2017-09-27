'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpAprobacionAnulacionCtrl
 * @description
 * # RpRpAprobacionAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RpRpAprobacionAnulacionCtrl', function ($translate,$scope,financieraRequest,financieraMidRequest,agoraRequest) {
     var self = this;
      self.rubros_afectados = [];
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Consecutivo',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('NO'),headerCellClass: 'text-info' },
        {field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.NumeroRegistroPresupuestal',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('RP_NUMERO'),headerCellClass: 'text-info' },
        {field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Vigencia',   displayName: $translate.instant('VIGENCIA'), cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'FechaRegistro' , displayName : $translate.instant('FECHA_CREACION'), cellClass: 'input_center',cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>',headerCellClass: 'text-info'},
        {field: 'TipoAnulacion',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('TIPO'),headerCellClass: 'text-info' },
        {field: 'EstadoAnulacion.Nombre', displayName : $translate.instant('ESTADO'),headerCellClass: 'text-info'},
        {field: 'AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DataSolicitud.DependenciaSolicitante.Nombre' , displayName : $translate.instant('DEPENDENCIA_SOLICITANTE'),headerCellClass: 'text-info'},
        {
          field: 'Opciones',
          cellTemplate: '<center>' +
          ' <a type="button" class="editar" ng-click="grid.appScope.rpAprobacionAnulacion.verRp(row)" >'+
          '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>',
          headerCellClass: 'text-info'
        }
      ],
      onRegisterApi : function( gridApi ) {
        self.gridApi = gridApi;
      }
    };
    self.gridOptions.multiSelect = false;
    self.cargarListaAnulaciones = function(){
      financieraRequest.get('anulacion_registro_presupuestal',$.param({
        limit: -1
      })).then(function(response){
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function(data){
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.Solicitud,'').then(function(response) {
            data.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Disponibilidad.DataSolicitud = response.data[0];
          });
        });
      });
    };

    self.cargarListaAnulaciones();

    Array.prototype.indexOfOld = Array.prototype.indexOf;

    Array.prototype.indexOf = function(e, fn) {
      if (!fn) {
        return this.indexOfOld(e);
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
        var dispapr = angular.copy(data.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion);
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


    self.verRp = function(row){
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      self.anulacion = row.entity;
      self.resumen = self.formatoResumenAfectacion(self.anulacion.AnulacionRegistroPresupuestalDisponibilidadApropiacion);
      console.log(row.entity)
      financieraRequest.get('registro_presupuestal', 'query=Id:' + row.entity.AnulacionRegistroPresupuestalDisponibilidadApropiacion[0].RegistroPresupuestalDisponibilidadApropiacion.RegistroPresupuestal.Id).then(function (response) {

        self.detalle = response.data;
        angular.forEach(self.detalle, function (data) {

          agoraRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function (response) {

            data.Beneficiario = response.data;

          });
        });
        angular.forEach(self.detalle, function (data) {
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'query=RegistroPresupuestal.Id:' + data.Id).then(function (response) {
            self.rubros = response.data;
            data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
            angular.forEach(self.rubros, function (rubros_data) {
              var rpdata = {
                Rp: rubros_data.RegistroPresupuestal,
                Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
              };
              financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function (response) {
                rubros_data.Saldo = response.data;
              });
              financieraMidRequest.get('disponibilidad/SolicitudById/' + rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function (response) {
                var solicitud = response.data
                angular.forEach(solicitud, function (data) {
                  self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                  console.log(self.Necesidad);


                });

              });
              if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

              } else {
                $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
              }

            });

          });

        });
      });

    };

    self.solicitarAnulacion = function(){
      self.anulacion.EstadoAnulacion.Id = 2;
      self.anulacion.Solicitante = 1234567890;//tomar del prefil
      financieraRequest.post('registro_presupuestal/AprobarAnulacion',self.anulacion).then(function(response){
        console.log(response.data);
        if (response.data.Type !== undefined){
          if (response.data.Type === "error"){
            swal('',$translate.instant(response.data.Code),response.data.Type);
          }else{
            swal('',$translate.instant(response.data.Code)+' '+response.data.Body.Consecutivo,response.data.Type).then(function(){
              $("#myModal").modal('hide');
              self.cargarListaAnulaciones();
            });
          }

        }
      });
    };

    self.aprobarAnulacion = function(){
      self.anulacion.EstadoAnulacion.Id = 3;
      self.anulacion.Responsable = 876543216;//tomar del prefil
      financieraRequest.post('registro_presupuestal/AprobarAnulacion',self.anulacion).then(function(response){
        console.log(response.data);
        if (response.data.Type !== undefined){
          if (response.data.Type === "error"){
            swal('',$translate.instant(response.data.Code),response.data.Type);
          }else{
            swal('',$translate.instant(response.data.Code)+response.data.Body.Consecutivo,response.data.Type).then(function(){
              $("#myModal").modal('hide');
              self.cargarListaAnulaciones();
            });
          }

        }
      });
    };

    self.Rechazar = function (){
       var solicitud = self.anulacion;
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
         solicitud.JustificacionRechazo = text;
         solicitud.EstadoAnulacion.Id = 4;
         console.log(solicitud);
         var sl = solicitud;
           financieraRequest.put('anulacion_registro_presupuestal/', sl.Id+"?fields=justificacion_rechazo,estado_anulacion" , sl).then(function(response) {
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
