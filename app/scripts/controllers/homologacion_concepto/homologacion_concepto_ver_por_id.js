 'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:HomologacionConceptoHomologacionConceptoVerPorIdCtrl
 * @description
 * # HomologacionConceptoHomologacionConceptoVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('HomologacionConceptoVerPorIdCtrl', function($scope, $routeParams, financieraRequest, financieraMidRequest, titanRequest, agoraRequest, coreRequest, oikosRequest) {
    var self = this;
    self.HomologacionId = $routeParams.Id;
    financieraRequest.get("homologacion_concepto",
      $.param({
        query: "Id:" + self.HomologacionId,
        limit: 1,
      })
    ).then(function(response) {
      self.homologacionConcepto = response.data[0];
      // data concepti titan
      titanRequest.get('concepto_nomina',
        $.param({
          query: "Id:" + self.homologacionConcepto.ConceptoTitan,
          limit: 1
        })
      ).then(function(response) {
        self.ConceptoTitanData = response.data[0];
      })
      // data nomina titan
      titanRequest.get('nomina',
        $.param({
          query: "Id:" + self.homologacionConcepto.NominaTitan,
          limit: 1
        })
      ).then(function(response) {
        self.NominaTitanData = response.data[0];
      })
      // Proyecto y facultad
      financieraRequest.get('concepto_tesoral_facultad_proyecto',
        $.param({
          query: "HomologacionConcepto.Id:" + self.homologacionConcepto.Id,
          limit: 1
        })
      ).then(function(response) {
        self.ConceptoFaculatadProyecto = response.data[0];
        // data proyecto y Facultad
        oikosRequest.get('dependencia',
          $.param({
            query: "Id:" + self.ConceptoFaculatadProyecto.Facultad,
            limit: 1
          })
        ).then(function(response) {
          self.FacultadData = response.data[0];
        });
        oikosRequest.get('dependencia',
          $.param({
            query: "Id:" + self.ConceptoFaculatadProyecto.ProyectoCurricular,
            limit: 1
          })
        ).then(function(response) {
          self.ProyectoCurricularData = response.data[0];
        })
      })
    })
    //
  });
