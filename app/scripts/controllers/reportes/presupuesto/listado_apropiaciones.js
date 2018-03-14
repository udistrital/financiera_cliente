'use strict';

/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesPresupuestoListadoApropiacionesCtrl
* @description
* # ReportesPresupuestoListadoApropiacionesCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReporteListadoApropiacionesCtrl', function (financieraRequest, $filter, uiGridConstants, $http, $q) {
  var ctrl = this;
  var rubros = [];
  var escudoUd64;

  ctrl.gridOptions = {
    enableFiltering: false,
    enableSorting: false,
    enableRowHeaderSelection: false,
    rowHeight: 30,
    paginationPageSizes: [20, 50, 100],
     paginationPageSize: 20,

    columnDefs: [
      { field: 'Rubro.Codigo' ,
        sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        },
      { field: 'Rubro.Nombre' },
      { field: 'Valor', cellFilter: 'currency', cellClass: 'right-letters' }
    ]
  };

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

  var reporte = {
    pageSize: 'A4',
    content: [],
    footer: "",
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
        alignment: 'center'
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      table: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      },
      lineaFirma: {
        margin: [0,8,0,10],
        alignment: 'center'
      },
      firmas: {
        alignment: "center",
        fontSize: 10
      },
      footer: {
        alignment: "center",
        fontSize: 10
      }
    }
  }

  function getHijosRubros(idRubro) {
    var defered = $q.defer();
    var promise = defered.promise;

    financieraRequest.get('rubro_rubro', $.param({
      limit: 0,
      query: 'Rubro.Padre:'+idRubro
    })).then(function(response) {
      defered.resolve(response.data);
      return promise;
    }, function(err) {
      defered.reject(err);
    });
  }

  function getFechaActual() {
    var defered = $q.defer();
    var promise = defered.promise;

    financieraRequest.get("orden_pago/FechaActual/01-02-2006 15:04:05 PM").then(function(response) {
      defered.resolve(response.data);
     }, function(err) {
       defered.reject(err)
     });
     return promise;
  }

  ctrl.buscarApropiaciones = function() {
    reporte.content = [];
    financieraRequest.get('entidad').then(function(response) {
      ctrl.entidad = response.data[0];
    });

    var apropiaciones = [];
    financieraRequest.get('apropiacion/ArbolApropiaciones/'+ctrl.vigencia)
      .then(function(response) {
      var arbolApropiaciones = response.data;
      var apropiaciones = arbolRubrosRecursivo(arbolApropiaciones,[]);


      var tabla = {
        style: 'table',
        table: {
          headerRows: 1,
          dontBreakRows: true,
          keepWithHeaderRows: 0,
          body:
            [
              [{text: 'Código', style: 'tableHeader'},
              {text: 'Nombre', style: 'tableHeader'},
              {text: 'Valor', style: 'tableHeader'}]
            ]
        }
      };

      for (var i = 0; i < apropiaciones.length; i++) {
        tabla.table.body.push(
          [
            { text: apropiaciones[i].Codigo },
            { text: apropiaciones[i].Nombre },
            { text: $filter("currency")(apropiaciones[i].Valor), alignment: "right" }
          ]
        );
      }


      reporte.content = [
        { image: escudoUd64.imagen, alignment: 'center', width: 100 },
        {text: 'Listado de Apropiaciones', style: 'header'},
        {text: 'Vigencia: '+ctrl.vigencia, style: 'subheader'},
        {text: 'Entidad: '+ctrl.entidad.Nombre, style: 'subheader'},
        {text: 'Unidad Ejecutora: '+ctrl.unidadEjecutora.Nombre, style: 'subheader'},
        tabla,
        { text: 'ELABORO', style: "firmas" },
        { text: '[USUARIO_SESIÓN]', bold: true, style: "firmas" }
      ];

      getFechaActual()
        .then(function(data) {
          reporte.content.push(
            { text: "Fecha y hora de impresión: " + data, style: "footer" }
          );
          pdfMake.createPdf(reporte).download('Listado_de_apropiaciones.pdf');
        }).catch(function(err) {
          return
        })


    }, function(err) {
      return
    });
}

function arbolRubrosRecursivo(arbol,resul) {
  var resTemp = resul;

  if (arbol !== null) {
    for (var i = 0; i < arbol.length; i++) {
      var obj = {Codigo: arbol[i].Codigo, Nombre: arbol[i].Nombre, Valor: arbol[i].Apropiacion.Valor}
      resTemp.push(obj);
      arbolRubrosRecursivo(arbol[i].Hijos, resTemp);
    }
  }
  return resTemp;
}
});
