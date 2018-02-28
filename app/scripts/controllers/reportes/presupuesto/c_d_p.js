'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ReportesPresupuestoCDPCtrl
 * @description
 * # ReportesPresupuestoCDPCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ReportesPresupuestoCDPCtrl', function (financieraRequest, oikosRequest, administrativaPruebasRequest, $q) {
    var ctrl = this;
    var docDefinition = {};
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

    // Entidad
    function asynEntidad() {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get('entidad/'+ctrl.unidadEjecutora.Entidad.Id)
        .then(function(response) {
          defered.resolve(response.data);
        }, function(err) {
          defered.reject(err);
        });

      return promise;
    }

    //Rubro
    function asynRubro(idRubro) {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get('rubro/'+idRubro)
        .then(function(response) {
          defered.resolve(response.data);
        }, function(err) {
          defered.reject(err);
        });

        return promise;
    }

    // Apropiacion
    function asynApropiacion(idApropiacion) {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get('apropiacion/'+idApropiacion)
        .then(function(response) {
          defered.resolve(response.data);
        }, function(err) {
          defered.reject(err);
      });

      return promise;
    }

    // Fuente de finaciamiento apropiacion
    function asynFuentFinanApropiacion(idFuente) {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get('fuente_financiamiento_apropiacion', $.param({
        limit: 1,
        query: 'FuenteFinanciamiento:'+idFuente+',Dependencia:'+ctrl.dependencia.Id
      })).then(function(response) {
        defered.resolve(response.data);
      }, function(err) {
        defered.reject(err);
      });

      return promise;
    }

    // Fuente de financiamiento
    function asynFuentFinan(idFuente) {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get('fuente_financiamiento/'+idFuente, $.param({
        query: 'TipoFuenteFinanciamiento.Id:'+ctrl.tipoFuenteFinanciamiento.Id
      })).then(function(response) {
        defered.resolve(response.data);
      }, function(err) {
        defered.reject(err);
      });

      return promise;
    }

    ctrl.generarReporte = function() {
      administrativaPruebasRequest.get('fuente_financiacion_rubro_necesidad', $.param({
        limit: 1,
        query: 'Necesidad.Numero:'+ctrl.necesidad+',Necesidad.Vigencia:'+ctrl.vigencia
      })).then(function(response) {
        if (response.data === null) {
          swal(
            'No se encontraron datos que coincidan con la necesidad y la vigencia'
          )
        } else {
          docDefinition = {text: 'UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS'}

          asynFuentFinan(response.data[0].FuenteFinanciamiento)
            .then(function(data) {
              console.log(data);

                asynFuentFinanApropiacion(data.Id)
                  .then(function(data) {
                    console.log(data);

                    asynApropiacion(data[0].Apropiacion.Id)
                      .then(function(data) {
                        console.log(data);

                        asynRubro(data.Rubro.Id)
                          .then(function(data) {
                            console.log(data);
                          }).catch(function(err) {
                            console.log(error);
                          });

                      }).catch(function(err) {
                        console.error(err);
                      });

                  }).catch(function(err) {
                    console.error(err);
                  });

            }).catch(function(err) {
              console.error(err);
            });

            asynEntidad()
              .then(function(data) {
                console.log(data);
              }).catch(function(err) {
                console.error(err);
              });

        }
    }, function(err) { //if something happends
    });

    }

  });
