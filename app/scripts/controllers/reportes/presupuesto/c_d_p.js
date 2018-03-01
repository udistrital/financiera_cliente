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
    var reporte = { content: [], styles: {}};

    // Estilos del reporte
    var estilos = {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0,0,0,20]
      },
      subheader: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [10,0,0,0]
      },
      subheader_part: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [0,0,0,10]
      },
      paragraph: {
        fontSize: 11,
        alignment: 'center',
        margin: [0,0,0, 20]
      },
      rubro_table: {
        marign: [10,20,10,20],
        alignment: 'center',
        border: undefined
      },
      table_header: {
        fontSize: 12,
        alignment: 'center',
        bold: true,
        margin: [2,2,2,2]
      },
      table_content: {
        fontSize: 12,
        margin: [0,5,0,0],
        alignment: 'center',
        border: undefined
      },
      objeto: {
        fontSize: 12,
        margin: [0,5,5,0],
        alignment: 'center'
      }
    }
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
        return response.data;
      }, function(err) {
        defered.reject(err);
      });

      return promise;
    }

    ctrl.generarReporte = function() {
      reporte.styles = estilos;
      var entidad;
      administrativaPruebasRequest.get('fuente_financiacion_rubro_necesidad', $.param({
        limit: 1,
        query: 'Necesidad.Numero:'+ctrl.necesidad+',Necesidad.Vigencia:'+ctrl.vigencia
      })).then(function(response) {
        if (response.data === null) {
          swal(
            'No se encontraron datos que coincidan con la necesidad y la vigencia'
          )
        } else {
          ctrl.fuenteFinanciacionNecesidad = response.data[0];
          asynFuentFinan(response.data[0].FuenteFinanciamiento)
            .then(function(data) {
              ctrl.fuentesFinanciamiento = data;

                asynFuentFinanApropiacion(data.Id)
                  .then(function(data) {
                    console.log(data);

                    asynApropiacion(data[0].Apropiacion.Id)
                      .then(function(data) {
                        ctrl.apropiacion = data;

                        asynRubro(data.Rubro.Id)
                          .then(function(data) {
                            ctrl.rubro = data;

                            asynEntidad()
                              .then(function(data) {
                                reporte.content.push(
                                  { text: data.Nombre, style: 'header' },
                                  { text: data.CodigoEntidad+' - '+data.Nombre, style: 'subheader' },
                                  { text: ctrl.unidadEjecutora.Id+' - '+ctrl.unidadEjecutora.Nombre, style: 'subheader_part' },
                                  { text: 'CERTIFICADO DE DISPONIBILIDAD PRESUPUESTAL', style: 'subheader' },
                                  { text: 'No.   1', style: 'subheader_part' },
                                  { text: 'EL SUSCRITO RESPONSABLE DEL PRESUPUESTO', style: 'subheader' },
                                  { text: 'CERTIFICA', style: 'subheader_part' },
                                  { text: 'Que en el Presupuesto de Gastos e Inversiones de la vigencia '+ctrl.vigencia+' existe apropiación disponible para atender a la presente solicitud así: ', style: 'paragraph' },
                                  {
                                    style: 'rubro_table',
                                    table:
                                    {
                                      headerRows: 1,
                                      widths: ['40%', '40%', '20%'],
                                      body:
                                        [
                                          [{ text: 'CODIGO PRESUPUESTAL ', style: 'table_header'}, { text: 'CONCEPTO', style: 'table_header'}, { text: 'VALOR', style: 'table_header'}],
                                          [{ text: ctrl.rubro.Codigo, style: 'table_content' }, { text: ctrl.rubro.Nombre, style: 'table_content'}, { text: ctrl.apropiacion.Valor, style: 'table_content'}]
                                        ]
                                      }
                                  },
                                  { text: 'OBJETO:', bold: true, margin: [0,20,0,10] },
                                  { text:  ctrl.fuenteFinanciacionNecesidad.Necesidad.Objeto, style: 'objeto'});

                                pdfMake.createPdf(reporte).download('cdp.pdf');
                            }).catch(function(err) {
                                console.error(err);
                            });

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

        }
      }, function(err) { //if something happends
      });

      reporte.content = [];
    }
  });
