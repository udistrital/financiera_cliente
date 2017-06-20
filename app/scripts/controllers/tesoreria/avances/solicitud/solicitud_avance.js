'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SolicitudAvanceCtrl
 * @description
 * # SolicitudAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('SolicitudAvanceCtrl', function($scope, modelsRequest, financieraRequest) {
    var ctrl = this;
    $scope.info_terceros = true;
    $scope.info_desc_avances = true;
    $scope.info_detalle_avances = true;
    ctrl.tipos_avance = [];

    ctrl.get_tipos_avance = function() {
      financieraRequest.get("tipo_avance", $.param({
          query: "Estado:" + 'A',
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          ctrl.tipos_avance = response.data;
          console.log(ctrl.tipos_avance);
        });
    };

    ctrl.get_terceros = function() {
      modelsRequest.get("terceros_completo")
        .then(function(response) {
          if (ctrl.documento === response.data.documento) {
            ctrl.terceros = response.data;
            ctrl.get_tipos_avance();
          } else {
            ctrl.documento = "";
            ctrl.terceros = [];
          }
          console.log(ctrl.terceros);
        });
    };



    ctrl.enviar = function(){
      var Solicitud = {};
      var TipoAvance = {};
      var SolicitudAvance = {};
      Solicitud.IdBeneficiario = parseInt(ctrl.documento);
      Solicitud.Objetivo = ctrl.objetivo;
      Solicitud.Justificacion = ctrl.justificacion;
      Solicitud.CodigoDependencia = ctrl.terceros.dependencia.id;
      Solicitud.Dependencia = ctrl.terceros.dependencia.dependencia;
      Solicitud.CodigoFacultad = ctrl.terceros.proyecto_curricular.facultad.id;
      Solicitud.Facultad = ctrl.terceros.proyecto_curricular.facultad.Facultad;
      Solicitud.CodigoProyectoCur = ctrl.terceros.proyecto_curricular.CodigoProyectoCurricular.id;
      Solicitud.ProyectoCurricular = ctrl.terceros.proyecto_curricular.CodigoProyectoCurricular.ProyectoCurricular;
      Solicitud.ValorTotal = ctrl.valor_avance;


      Solicitud.CodigoConvenio = ctrl.codigo_convenio;
      Solicitud.Convenio = ctrl.nombre_convenio;
      Solicitud.CodigoProyectoInv = ctrl.codigo_proyecto_inv;
      Solicitud.ProyectoInv = ctrl.nombre_proyecto_inv;

      TipoAvance.Id = parseInt(ctrl.tipo_avance_select);
      TipoAvance.Descripcion = ctrl.descripcion;
      TipoAvance.Valor = parseFloat(ctrl.valor_avance);

      SolicitudAvance.Solicitud = Solicitud;
      SolicitudAvance.TipoAvance = TipoAvance;
      console.log(SolicitudAvance);
      financieraRequest.post("solicitud_avance/TrSolicitudAvance", SolicitudAvance)
        .then(function(response) {
          console.log(response);
        });
    };



  });
