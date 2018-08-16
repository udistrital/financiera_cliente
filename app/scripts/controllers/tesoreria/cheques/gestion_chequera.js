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
    ctrl.respEnc=true;
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
      if(!angular.isUndefined(ctrl.banco)){
        financieraMidRequest.get('gestion_sucursales/ListarSucursalesBanco/'+ctrl.banco.Id).then(function(response){
          if (response.data != null) {
              ctrl.sucursales = response.data;
          }
        });
      }

    }

    ctrl.consultarCuentas = function(){
      ctrl.cuentasBancarias = [];
      if (!angular.isUndefined(ctrl.sucursal)){
        financieraRequest.get('cuenta_bancaria',$.param({
          query:"Sucursal:"+ctrl.sucursal.OrganizacionHija.Id
        })).then(function(response){
          if (response.data != null && response.data.indexOf("no row found")<0) {
            ctrl.cuentasBancarias = response.data;
          }
        });
      }

    }

    ctrl.consultaResponsable = function(){
      ctrl.cargandoResponsable=true;
      agoraRequest.get('supervisor_contrato',$.param({
        query:"Documento:" + ctrl.numdocResponsable+",Cargo__icontains:tesorer",
        limit:-1
      })).then(function(response){
          if(!angular.isUndefined(response.data) && typeof(response.data) !== "string" && response.data !=null){
              ctrl.nombreResponsable = response.data[0].Nombre;
              ctrl.respEnc=true;
              ctrl.cargandoResponsable = false;
          }else{
            ctrl.nombreResponsable = $translate.instant('NO_ENCONTRADO');
            ctrl.cargandoResponsable = false;
            ctrl.respEnc=false;
          }
        });
    }

    ctrl.camposObligatorios = function() {
      var respuesta;
      ctrl.MensajesAlerta = '';

      if($scope.chequera.$invalid){
        angular.forEach($scope.chequera.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });

        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
      }

      if(angular.isUndefined(ctrl.nombreResponsable)|| ctrl.nombreResponsable.length === 0){
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_RESP_NO_ENC") + "</li>";
          ctrl.respEnc=false;
      }


      if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
    };

    ctrl.registrarChequera = function(){
      if(ctrl.camposObligatorios()){

      }else{
        swal({ title:'¡Error!',
              html:'<ol align="left">'+ctrl.MensajesAlerta+'</ol>',
              type:'error'
          });
      }
    }




  });
