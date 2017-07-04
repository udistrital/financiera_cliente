'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SolicitudAvanceCtrl
 * @description
 * # SolicitudAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('SolicitudAvanceCtrl', function($scope, modelsRequest, financieraRequest, $translate) {
    var ctrl = this;
    $scope.info_terceros = true;
    $scope.info_desc_avances = true;
    $scope.info_detalle_avances = true;
    ctrl.tipos_avance = [];
    ctrl.lista_tipos = [];

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

    ctrl.anadir_tipo = function(){
      if  (ctrl.tipo_avance_select !== '' && ctrl.tipo_avance_select !== 'undefined' &&
          ctrl.valor_avance !== '' && ctrl.valor_avance !== 'undefined' &&
          ctrl.descripcion !== '' && ctrl.descripcion !== 'undefined' ){
        var TipoAvance = {};
        for (var i = 0; i < ctrl.tipos_avance.length; i++) {
          if (ctrl.tipos_avance[i].Id == ctrl.tipo_avance_select){
            console.log(ctrl.tipos_avance[i]);
            TipoAvance.Descripcion = ctrl.descripcion;
            TipoAvance.Valor = parseFloat(ctrl.valor_avance);
            var tipo = ctrl.tipos_avance.splice(i, 1);
            TipoAvance.TipoAvance = tipo[0];
            TipoAvance.requisitos_seleccionados = [];
            //recopilando requisitos
            financieraRequest.get("requisito_tipo_avance", $.param({
                query: "TipoAvance:" + ctrl.tipo_avance_select + ",Estado:" + "A" ,
                limit: -1,
                fields: "RequisitoAvance,TipoAvance",
                sortby: "TipoAvance",
                order: "asc"
              }))
              .then(function(response) {
                TipoAvance.requisitos_seleccionados.push(response.data);
              });
              console.log(ctrl.requisitos_seleccionados);
            ctrl.lista_tipos.push(TipoAvance);

            ctrl.descripcion = '';
            ctrl.valor_avance = '';
            ctrl.tipo_avance_select = '';
          }
        }
        console.log(ctrl.lista_tipos);
      }
    };

    ctrl.enviar = function(){
      var Solicitud = {};

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
      Solicitud.ValorTotal = 0;

      Solicitud.CodigoConvenio = ctrl.codigo_convenio;
      Solicitud.Convenio = ctrl.nombre_convenio;
      Solicitud.CodigoProyectoInv = ctrl.codigo_proyecto_inv;
      Solicitud.ProyectoInv = ctrl.nombre_proyecto_inv;
      SolicitudAvance.Solicitud = Solicitud;
      SolicitudAvance.TipoAvance = ctrl.lista_tipos;
      console.log(SolicitudAvance);

      /* financieraRequest.post("solicitud_avance/TrSolicitudAvance", SolicitudAvance)
        .then(function(response) {
          console.log(response.data);
          if (response.data.Type !== undefined){
            if (response.data.Type === "error"){
              swal('',$translate.instant(response.data.Code),response.data.Type);
            }else{
              swal('',$translate.instant(response.data.Code)+response.data.Body.Consecutivo,response.data.Type);
            }
          }
        });*/
    };



  });
