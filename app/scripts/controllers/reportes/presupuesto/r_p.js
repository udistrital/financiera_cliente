'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ReportesPresupuestoRPCtrl
 * @description
 * # ReportesPresupuestoRPCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ReportesPresupuestoRPCtrl', function (financieraRequest, financieraMidRequest, oikosRequest, coreRequest, administrativaRequest, $http, $q, $filter, $translate) {
    var ctrl = this;
    var escudoUd64;
    var entidad;
    var producto =
    {
        Codigo: "123424543545",
        Nombre: "PRODUCTO PRUEBA"
    }
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var f = new Date();

    // Estilos del reporte
    var estilos = {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0,0,0,20]
      },
      subheader: {
        fontSize: 12,
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
        alignment: "center",
        border: undefined
      },
      table_header: {
        fontSize: 11,
        alignment: 'center',
        bold: true,
        margin: [2,2,2,2]
      },
      table_content: {
        fontSize: 10,
        margin: [0,5,0,0],
        alignment: 'center',
        border: undefined
      },
      objeto: {
        fontSize: 10,
        margin: [0,20,0,20],
        alignment: 'center'
      },
      lineaFirma: {
        margin: [0,15,0,10],
        alignment: 'center'
      },
      valores: {
        margin: [0,10,0,10],
        alignment: 'right',
        bold: true,
        fontSize: 11
      },
      firmas: {
        alignment: "center",
        fontSize: 10
      }
    };
    var reporte = { content: [], styles: estilos };

    // Imagen UD
    $http.get("scripts/models/imagen_ud.json").then(function(response) {
      escudoUd64 = response.data;
    }, function(err) {
      return
    });

    // Vigencias de apropiaciones
    financieraRequest.get('apropiacion/VigenciaApropiaciones', $.param({
      limit: 0
    })).then(function(response) {
      ctrl.vigencias = response.data.sort();
    });

    // Unidades ejecutoras
    financieraRequest.get('unidad_ejecutora', $.param({
      limit: 0
    })).then(function(response) {
      ctrl.unidadesEjecutoras = response.data;
    });

    // Fuentes de finaciamiento
    financieraRequest.get('fuente_financiamiento', $.param({
      fields: 'Id,Nombre,Codigo,TipoFuenteFinanciamiento'
    })).then(function (response) {
      ctrl.fuentesFinanciamiento = response.data;
    });

    // Jefe de Presupuesto
    oikosRequest.get('dependencia', $.param({
      limit: 1,
      query: 'Nombre__icontains:PRESUPUESTO'
    })).then(function(response) {
      ctrl.dependenciaPresupuesto = response.data;

      coreRequest.get('jefe_dependencia', $.param({
        limit: 1,
        query: 'DependenciaId:'+ctrl.dependenciaPresupuesto[0].Id
      })).then(function(response) {

        administrativaRequest.get('informacion_proveedor/'+response.data[0].TerceroId)
          .then(function(response) {
            ctrl.jefePresupuesto = response.data;
          });
      });
    });

    function asynMovFuenteFinanApropiacion() {
      var defered = $q.defer();
      var promise = defered.promise;

      financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", $.param({
        limit: -1,
        query: 'FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id:'+ctrl.fuenteFinanciamiento.Id+',Fecha__startswith:'+ctrl.vigencia
      })).then(function(response) {
        var valorTotal = 0;
        var fuente_financiamiento_apropiacion = response.data;
        if (fuente_financiamiento_apropiacion) {
          for (var i = 0; i < fuente_financiamiento_apropiacion.length; i++) {
            valorTotal += fuente_financiamiento_apropiacion[i].Valor;
          }
        }
        defered.resolve(valorTotal);
      }, function(err) {
        defered.reject(err);
      });
      return promise;
    }

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

    function asynProvedor(idProveedor) {
      var defered = $q.defer();
      var promise = defered.promise;

      administrativaRequest.get("informacion_proveedor/"+idProveedor).then(function(response) {
        defered.resolve(response.data);
      }, function(err) {
        defered.reject(err);
      });

      return promise;
    }

    ctrl.generarReporte = function() {
      asynEntidad()
        .then(function(data) {
          entidad = data;

        financieraMidRequest.get('registro_presupuestal/ListaRp/'+ctrl.vigencia, $.param({
          limit: -1,
          UnidadEjecutora: ctrl.unidadEjecutora.Id,
          query: "RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Id:"+ctrl.fuenteFinanciamiento.Id
        })).then(function(response) {

              var datosCrp;
              var fuente_crp = response.data;
              var totalCrp = 0;

              for (var i = 0; i < fuente_crp.length; i++) {
                if (fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad === ctrl.numCdp) {
                  datosCrp = fuente_crp[i];
                } else {
                  for (var j = 0; j < fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion.length; j++) {
                    fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[0] = fuente_crp[i].RegistroPresupuestalDisponibilidadApropiacion[j];
                  }
                }
              }

              if (datosCrp.NumeroRegistroPresupuestal === 1) {
                var valorDisponible = datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Valor - datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Valor;
              } else {
                var valorDisponible = datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Valor - (totalCrp + datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Valor);
              }

              asynProvedor(datosCrp.Beneficiario)
                .then(function(data) {
                  var beneficiario = data;
                  construirReporte(datosCrp, totalCrp, valorDisponible, datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Valor, beneficiario);
                }).catch(function(err) {
                  return
                });

            }).catch(function(err) {
              return
            });
      }, function(err) {
        return
      });
    }


    function construirReporte(datosCrp, valorCdp, valorDisponible, valorTotal, beneficiario) {
      reporte.content = [];
      reporte.styles = estilos;
      reporte.content.push(
        { image: escudoUd64.imagen, alignment: 'center', width: 100 },
        { text: entidad.Nombre+'', style: 'header' },
        { text: entidad.CodigoEntidad+' - '+entidad.Nombre, style: 'subheader' },
        { text: 'Unidad Ejecutora: '+ctrl.unidadEjecutora.Id+' - '+ctrl.unidadEjecutora.Nombre, style: 'subheader_part' },
        { text: 'CERTIFICADO DE REGISTRO PRESUPUESTAL', style: 'subheader' },
        { text: "No. "+datosCrp.NumeroRegistroPresupuestal, style: 'subheader_part' },
        { text: "Que se ha efectuado registro presupuestal para atender compromisos así: ", alignment: "center", margin: [0,0,0,25] }
      );

      reporte.content.push(
        function () {
          var tabla = {
            style: 'rubro_table',
            table: {
              widths: ["25%", "40%", "35%"],
              headerRows: 1,
              body: [
                [
                  { text: 'CODIGO PRESUPUESTAL ', style: 'table_header'},
                  { text: 'RUBRO', style: 'table_header'},
                  { text: 'VALOR', style: 'table_header'}
                ]
              ]
            }
          };
          tabla.table.body.push(
            [{ text: datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Codigo, style: 'table_content' },
            { text: datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Apropiacion.Rubro.Nombre, style: 'table_content' },
            { text: $filter('currency')(datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Valor), style: 'table_content' }]
          );
        return tabla
        }()
      );

      reporte.content.push(
        { text: 'Valor Apropiacion: '+$filter('currency')(valorTotal), style: 'valores' },
        { text: 'Valor Disponible: '+$filter('currency')(valorDisponible), style: 'valores' }
      );

      if (ctrl.fuenteFinanciamiento.TipoFuenteFinanciamiento.Nombre === "Inversión") {
        reporte.content.push(
          { text: [ {text: "Fuente de inversión: ", bold: true},
              ctrl.fuenteFinanciamiento.Nombre
            ]},
          { text: [
              {text: "Producto: ", bold: true},
              producto.Nombre
            ]}
        );
      }

      reporte.content.push(
        { text: "CDP Nº:"+datosCrp.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad, fontSize: 10, bold: true, margin: [0,20,0,5] },
        { text: "TIPO DE COMPROMISO: " + datosCrp.TipoCompromiso.Objeto },
        { text: "OBJETO: " + datosCrp.TipoCompromiso.Objeto }
      );
      if (beneficiario.Tipopersona === "NATURAL") {
        reporte.content.push(
            { text: "BENEFICIARIO: "+beneficiario.NomProveedor+" identificado con Documento "+beneficiario.NumDocumento }
        );
      } else {
        reporte.content.push(
            { text: "BENEFICIARIO: "+beneficiario.NomProveedor+" identificado con NIT "+beneficiario.NumDocumento }
        );
      }

      reporte.content.push(
        { text: 'Bogotá D.C, '+f.getDate()+' de '+meses[f.getMonth()]+' del '+f.getFullYear(), alignment: 'left', margin: [0,15,0,0]},
        { text: '', margin: [0,30,0,30]},
        { text: '_______________________', style: 'lineaFirma' },
        { text: ctrl.jefePresupuesto.NomProveedor, bold: true, style: "firmas" },
        { text: 'RESPONSABLE DE '+ctrl.dependenciaPresupuesto[0].Nombre, style: "firmas" },
        { text: '_______________________', style: 'lineaFirma' },
        { text: 'ELABORO', style: "firmas" },
        { text: '[USUARIO_SESIÓN]', bold: true, style: "firmas" }
      );

      pdfMake.createPdf(reporte).download('crp.pdf');
    }
  });
