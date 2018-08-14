'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeraCtrl
 * @description
 * # TesoreriaChequesGestionChequeraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeraCtrl', function ($scope,$translate,agoraRequest,financieraRequest,organizacionRequest,financieraMidRequest) {
    var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];
    ctrl.listasCargadas = false;
    ctrl.gridChequeras = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'CodigoHomologado',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '12%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '18%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '12%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('CUENTA_BANCARIA'),
              headerCellClass:'text-info',
              width: '18%',
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('CHEQUE_INICIAL'),
              headerCellClass:'text-info',
              width: '15%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('CHEQUE_FINAL'),
              headerCellClass:'text-info',
              width: '15%'
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '10%'
          }
      ]
    }

    ctrl.consultarListas = function(){
      if(ctrl.listasCargadas){
        financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
          var year = parseInt(response.data);
          ctrl.anos = [];
          for (var i = 0; i < 5; i++) {
            ctrl.anos.push(year - i);
          }
        });

        financieraRequest.get('unidad_ejecutora', $.param({
            limit: -1
        })).then(function(response) {
            ctrl.unidadesejecutoras = response.data;
        });

        agoraRequest.get('parametro_estandar',$.param({
          query:"ClaseParametro:Tipo Documento",
          limit:-1
        })).then(function(response){
          ctrl.tiposdoc = response.data;
        });

        organizacionRequest.get('organizacion/', $.param({
            limit: -1,
            query: "TipoOrganizacion.CodigoAbreviacion:EB",
        })).then(function(response) {
          ctrl.bancos = response.data;
        });


      }

    };

    ctrl.obtenerSucursales = function(){
      ctrl.sucursales = [];
      financieraMidRequest.get('gestion_sucursales/ListarSucursalesBanco/'+ctrl.banco.Id).then(function(response){
        if (response.data != null) {
            ctrl.sucursales = response.data;
        }
      });
    }

    ctrl.consultaResponsable = function(){
      agoraRequest.get('supervisor_contrato',$.param({
        query:"Documento:" + ctrl.fila.Devolucion.Solicitante,
        limit:-1
      })).then(function(response){
          if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){
              ctrl.nombreSolicitante = response.data[0].Nombre;
              ctrl.cargando_sol = false;
          }else{
            ctrl.nombreSolicitante = $translate.instant('NO_ENCONTRADO');
            ctrl.cargando_sol = false;
          }
        });
    }




  });
