'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ReportesPresupuestoCDPCtrl
 * @description
 * # ReportesPresupuestoCDPCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ReportesPresupuestoCDPCtrl', function (financieraRequest, oikosRequest, administrativaPruebasRequest) {
    var ctrl = this;

    ctrl.vigencias = [2017,2018]
    // // Vigencias de apropiaciones
    // financieraRequest.get('apropiacion/VigenciaApropiaciones', $.param({
    //   limit: 0
    // })).then(function(response) {
    //   console.log(response.data);
    //   ctrl.vigencias = response.data;
    // });

    // Unidades ejecutoras
    financieraRequest.get('unidad_ejecutora', $.param({
      limit: 0
    })).then(function(response) {
      ctrl.unidadesEjecutoras = response.data;
    });

    financieraRequest.get('tipo_fuente_financiamiento', $.param({
      fields: "Id,Nombre"
    })).then(function(response) {
      ctrl.tiposFuentesFinanciamiento = response.data;
    });

    oikosRequest.get('dependencia', $.param({
      limit: 0,
      fields: "Id,Nombre",
      sortby: "Nombre",
      order: "asc"
    })).then(function(response) {
      ctrl.dependencias = response.data;
    });

    function entidad(idEntidad) {
      financieraRequest.get('entidad', $.param({
        limit: 0,
        query: 'Id:'+idEntidad
      })).then(function(response) {
        if (response.data !== null) {
          console.log('entidad: ', response.data);
        }
      });
    }

    function rubro(idRubro) {
      financieraRequest.get('rubro', $.param({
        limit: 0,
        query: 'Id:'+idRubro
      })).then(function(response) {
        console.log('rubro: ',response.data);
      });
    }

    // Apropiacion
    function apropiacion(idApropiacion) {
      financieraRequest.get('apropiacion', $.param({
        limit: 0,
        query: 'Id:'+idApropiacion
      })).then(function(response) {
        if (response.data !== null) {
          console.log('apropiacion: ',response.data);
          rubro(response.data[0].Rubro.Id)
        }
      });
    }

    // Fuente de finaciamiento apropiacion
    function fuentFinanApropiacion(idFuenteFinanciamiento) {
      financieraRequest.get('fuente_financiamiento_apropiacion', $.param({
        limit:1,
        query: 'FuenteFinanciamiento.Id:'+idFuenteFinanciamiento+',Dependencia:'+ctrl.dependencia.Id
      })).then(function(response) {
        if (response.data !== null) {
          console.log("fuente_finacim eianto_apropiacion: ",response.data);
          apropiacion(response.data[0].Apropiacion.Id);
        }
      })
    }

    // Fuente de financiamiento
    function fuentFinan(idFuente) {
      financieraRequest.get('fuente_financiamiento', $.param({
        limit: 1,
        query: 'Id:'+idFuente
      })).then(function(response) {
        if (response.data !== null) {
          console.log("fuente financiamiento: ", response.data);
          fuentFinanApropiacion(response.data[0].Id);
        }
      });
    }


    ctrl.generarReporte = function() {
      console.log(ctrl.unidadEjecutora);
      entidad(ctrl.unidadEjecutora.Entidad.Id)
      administrativaPruebasRequest.get('fuente_financiacion_rubro_necesidad', $.param({
        limit: 1,
        query: 'Necesidad.Numero:'+ctrl.necesidad+',Necesidad.Vigencia:'+ctrl.vigencia
      })).then(function(response) {
        if (response.data === null) {
          swal(
            'No se encontraron datos que coincidan con la necesidad y la vigencia'
          )
        } else {
          fuentFinan(response.data[0].FuenteFinanciamiento);
        }
        //ctrl.necesidad = response
      });
    }

  });
