'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionDetalleFuenteCtrl
 * @description
 * # FuenteFinanciacionDetalleFuenteCtrl
 * Controller of the financieraClienteApp
 */
 angular.module('financieraClienteApp').controller('detalleFuenteCtrl', function($window, $scope, $translate, financieraMidRequest, financieraRequest, oikosRequest, coreRequest) {

     var self = this;
     self.gridOptions = {
       enableFiltering: true,
       enableSorting: true,
       enableRowSelection: true,
       enableRowHeaderSelection: false,
       paginationPageSizes: [5, 10, 15],
       paginationPageSize: 15,

       columnDefs: [{
           field: 'Id',
           visible: false
         },
         {
           displayName: $translate.instant('CODIGO'),
           field: 'Codigo',
           width: '10%',
         },
         {
           displayName: $translate.instant('TIPO'),
           field: 'TipoFuenteFinanciamiento.Nombre',
           width: '10%',
         },
         {
           displayName: $translate.instant('NOMBRE'),
           field: 'Nombre',
           width: '30%',
         },
         {
           displayName: $translate.instant('DESCRIPCION'),
           field: 'Descripcion',
           width: '50%',
         },
       ]

     };
     self.gridOptions.multiSelect = false;

     financieraRequest.get('fuente_financiamiento', 'limit=-1').then(function(response) {
       self.gridOptions.data = response.data;
     });

     financieraRequest.get("orden_pago/FechaActual/2006")
     .then(function(response) {
       self.vigenciaActual = parseInt(response.data);
       var dif = self.vigenciaActual - 1995 ;
       var range = [];
       range.push(self.vigenciaActual);
       for(var i=1;i<dif;i++) {
         range.push(self.vigenciaActual - i);
       }
       self.years = range;
       self.Vigencia = self.years[0];
     });

     self.gridOptionsapropiacion = {
       enableFiltering: true,
       enableSorting: false,
       treeRowHeaderAlwaysVisible: false,
       showTreeExpandNoChildren: false,
       rowEditWaitInterval: -1,
       paginationPageSizes: [5, 10, 15],
       paginationPageSize: 15,

       columnDefs: [{
           field: 'Id',
           visible: false
         },
         {
           field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Codigo',
           width: '18%',
           displayName: $translate.instant('CODIGO'),
         },
         {
           field: 'FuenteFinanciamientoApropiacion.Apropiacion.Rubro.Nombre',
           width: '25%',
           displayName: $translate.instant('RUBRO')
         },
         {
           field: 'FuenteFinanciamientoApropiacion.Dependencia.Nombre',
           width: '25%',
           displayName: $translate.instant('DEPENDENCIA')
         },
         {
           displayName: $translate.instant('FECHA'),
           field: 'Fecha',
           width: '10%',
           cellTemplate: '<div align="center">{{row.entity.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>'
         },
         {
           field: 'TipoMovimiento.Nombre',
           width: '10%',
           displayName: $translate.instant('MOVIMIENTO')
         },
         {
           field: 'TipoDocumento.TipoDocumento.Nombre',
           width: '15%',
           displayName: $translate.instant('TIPO_DOCUMENTO')
         },
         {
           field: 'TipoDocumento.JsonContenido.Documento.NoDocumento',
           width: '15%',
           displayName: $translate.instant('NO_DOCUMENTO')
         },
         {
           displayName: $translate.instant('FECHA_DOCUMENTO'),
           field: 'TipoDocumento.JsonContenido.Documento.Fecha',
           width: '15%',
           cellTemplate: '<div align="center">{{row.entity.TipoDocumento.JsonContenido.Documento.Fecha | date:"yyyy-MM-dd":"UTC"}}</div>'
         },
         {
           field: 'Valor',
           cellTemplate: '<div align="right">{{row.entity.Valor | currency}}</div>',
           displayName: $translate.instant('VALOR'),
           width: '15%'
         },
         {
           field: 'ValorGastado',
           cellTemplate: '<div align="right">{{row.entity.ValorGastado | currency}}</div>',
           displayName: $translate.instant('COMPROMETIDO'),
           width: '15%'
         }

       ]
     };
     self.gridOptionsapropiacion.multiSelect = false;

     self.cerrar_ventana = function() {
       $("#myModal").modal('hide');
     };

     self.fuente_seleccionada = {};
     self.fuente_financiamiento_apropiacion = [];

     self.gridOptions.onRegisterApi = function(gridApi) {
       self.gridApi = gridApi;
       gridApi.selection.on.rowSelectionChanged($scope, function(row) {
         self.valor_total = 0;
         self.fuente_seleccionada = row.entity;
         self.cambiar_rubro(row.entity);
         $("#myModal").modal();
       });
     };


         self.cambiar_rubro = function(fuente){
           self.gridOptionsapropiacion.data = [];

           if(fuente.TipoFuenteFinanciamiento.Nombre == "Inversión" ){
             self.tipo_fuente=1;
             financieraMidRequest.get("aprobacion_fuente/ValorMovimientoFuenteLista",$.param({
               idfuente: parseInt(fuente.Id)
             })).then(function(response) {

               self.gridOptionsapropiacion.data = response.data;
               angular.forEach(self.gridOptionsapropiacion.data, function (data) {
                 oikosRequest.get('dependencia', 'limit=1&query=Id:' + data.FuenteFinanciamientoApropiacion.Dependencia).then(function (response) {
                   data.FuenteFinanciamientoApropiacion.Dependencia = response.data[0];
                 });
               });

               angular.forEach(self.gridOptionsapropiacion.data, function (data) {
                 coreRequest.get('documento', 'limit=1&query=Id:' + data.TipoDocumento).then(function (response) {
                   data.TipoDocumento = response.data[0];
                   data.TipoDocumento.JsonContenido=JSON.parse(data.TipoDocumento.Contenido);
                   var mydate = new Date(data.TipoDocumento.JsonContenido.Documento.FechaDocumento);
                   data.TipoDocumento.JsonContenido.Documento.Fecha = mydate;
                   console.log(data.TipoDocumento.JsonContenido);

                 });
               });
               self.valor_total = 0;
               self.fuente_financiamiento_apropiacion1 = response.data;
               if(self.fuente_financiamiento_apropiacion1){
               for (var i = 0; i < self.fuente_financiamiento_apropiacion1.length; i++) {
                 self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion1[i].Valor;
               }
             }
             });

           }else{
             self.tipo_fuente=2;

             financieraMidRequest.get("aprobacion_fuente/ValorMovimientoFuenteListaFunc",$.param({
               idfuente: parseInt(fuente.Id)
             })).then(function(response) {

               self.gridOptionsapropiacion.data = response.data;
               angular.forEach(self.gridOptionsapropiacion.data, function (data) {
                 oikosRequest.get('dependencia', 'limit=1&query=Id:' + data.FuenteFinanciamientoApropiacion.Dependencia).then(function (response) {
                   data.FuenteFinanciamientoApropiacion.Dependencia = response.data[0];
                 });
               });

               angular.forEach(self.gridOptionsapropiacion.data, function (data) {
                 coreRequest.get('documento', 'limit=1&query=Id:' + data.TipoDocumento).then(function (response) {
                   data.TipoDocumento = response.data[0];
                   data.TipoDocumento.JsonContenido=JSON.parse(data.TipoDocumento.Contenido);
                   var mydate = new Date(data.TipoDocumento.JsonContenido.Documento.FechaDocumento);
                   data.TipoDocumento.JsonContenido.Documento.Fecha = mydate;
                   console.log(data.TipoDocumento.JsonContenido);

                 });
               });

               self.valor_total = 0;
               self.fuente_financiamiento_apropiacion1 = response.data;
               if(self.fuente_financiamiento_apropiacion1){

               for (var i = 0; i < self.fuente_financiamiento_apropiacion1.length; i++) {
                 self.valor_total = self.valor_total + self.fuente_financiamiento_apropiacion1[i].Valor;
               }
             }
           });

           }
         };
       });
