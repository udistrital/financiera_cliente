'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroRubroApropiacionPlaneacionCtrl
 * @description
 * # RubroRubroApropiacionPlaneacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroApropiacionPlaneacionCtrl', function (presupuestoRequest, presupuestoMidRequest, financieraMidRequest, token_service, $interval, $translate, $timeout, $scope) {
    var self = this;
    self.UnidadEjecutora = parseInt(token_service.getUe());
    self.cambioapr = 0;
    self.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editapr', estado: true },
    ];
    self.botonespadre = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    presupuestoRequest.get("date/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function (response) { //error con el success
        self.Vigencia = parseInt(response.data);
        self.vigenciaActual = parseInt(response.data);
        var dif = 2;
        var range = [];
        range.push(self.vigenciaActual);
        for (var i = 1; i < dif; i++) {
          range.push(self.vigenciaActual + i);
        }
        self.years = range;
        self.Vigencia = self.vigenciaActual;
      });

    self.GetAprobationInfo = function () {

      if (self.Vigencia !== undefined && self.Vigencia !== null && self.cambioapr !== undefined && self.cambioapr !== null) {
        presupuestoMidRequest.get("aprobacion_apropiacion/InformacionAsignacionInicial", $.param({
          UnidadEjecutora: self.UnidadEjecutora,
          Vigencia: self.Vigencia
        }))
          .then(function (response) { //error con el success

            self.InfoAprobacion = response.data.Body.InfoApropiacion;
            self.Aprobado = response.data.Body.Aprobado;
            console.log('apr', response.data.Body)
          }).catch(function (e) {
            console.log('error', e);
            swal('', $translate.instant('E_RB007'), 'error');
          });
      }
    }

    self.AprobarPresupuesto = function () {

      presupuestoMidRequest.post("aprobacion_apropiacion/AprobacionAsignacionInicial?UnidadEjecutora=1&Vigencia=" + self.Vigencia, self.InfoAprobacion)
        .then(function (response) { //error con el success
          if (response.data.Type !== undefined) {

            swal('', $translate.instant(response.data.Code), response.data.Type);


          }
        }).catch(function (e) {
          console.log('error', e);
          swal('', $translate.instant('E_0459'), 'error');
        });
    };

    $scope.$watch("rubroApropiacionPlaneacion.Vigencia", function () {
      self.GetAprobationInfo()

    }, true);

    $scope.$watch("rubroApropiacionPlaneacion.cambioapr", function () {
      self.GetAprobationInfo()

    }, true);

    var timer = $interval(self.GetAprobationInfo, 3000);

    $scope.$on('$destroy', function () {
      $interval.cancel(timer);
    });


  });
