'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeraCtrl
 * @description
 * # TesoreriaChequesGestionChequeraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeraCtrl', function ($scope,$translate,agoraRequest,financieraRequest,organizacionRequest,financieraMidRequest,gridApiService,$localStorage) {
    var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];
    $scope.estado_select = [];
    $scope.estados = [];
    ctrl.chequera = {};
    ctrl.chequera.numCheques = 0;
    ctrl.chequera.listasCargadas = false;
    ctrl.chequera.respEnc=true;
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
      multiSelect:false,
      columnDefs: [
          {
              field: 'Consecutivo',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '5%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              headerCellClass:'text-info',
              width: '10%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              headerCellClass:'text-info',
              width: '6%'
          },
          {
              field: 'Banco.Nombre',
              displayName: $translate.instant('BANCO'),
              headerCellClass:'text-info',
              width: '18%',
          },
          {
              field: 'Sucursal.Nombre',
              displayName: $translate.instant('SUCURSAL'),
              headerCellClass:'text-info',
              width: '18%',
          },
          {
              field: 'CuentaBancaria.Nombre',
              displayName: $translate.instant('CUENTA_BANCARIA'),
              headerCellClass:'text-info',
              width: '18%',
          },
          {
              field: 'NumeroChequeInicial',
              displayName: $translate.instant('CHEQUE_INICIAL'),
              headerCellClass:'text-info',
              width: '10%',
          },
          {
              field: 'NumeroChequeFinal',
              displayName: $translate.instant('CHEQUE_FINAL'),
              headerCellClass:'text-info',
              width: '10%'
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '5%'
          }
      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApiChequeras = gridApi;
        ctrl.gridApiChequeras = gridApiService.pagination(gridApi,ctrl.consultarChequeras,$scope);

      },
    }

    ctrl.consultarChequeras = function(offset,query){
      financieraMidRequest.cancel();

      financieraRequest.get("chequera/GetChequeraRecordsNumber",$.param({
        query:query
      })).then(function(response){
          ctrl.gridChequeras.totalItems = response.data.Body;
      });

      financieraMidRequest.get("gestion_cheques/GetAllChequera",$.param({
        limit: ctrl.gridChequeras.paginationPageSize,
        offset:offset,
        query:query
      })).then(function(response){
          ctrl.gridChequeras.data=response.data;
      });
    }

    ctrl.consultarChequeras(0,'');

    ctrl.consultarListas = function(){
      if(ctrl.chequera.listasCargadas){
        financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
          var year = parseInt(response.data);
          ctrl.chequera.anos = [];
          for (var i = 0; i < 5; i++) {
            ctrl.chequera.anos.push(year - i);
          }
        });

        financieraRequest.get('unidad_ejecutora', $.param({
            limit: -1
        })).then(function(response) {
            ctrl.chequera.unidadesejecutoras = response.data;
        });

        agoraRequest.get('parametro_estandar',$.param({
          query:"ClaseParametro:Tipo Documento",
          limit:-1
        })).then(function(response){
          ctrl.chequera.tiposdoc = response.data;
        });

        organizacionRequest.get('organizacion/', $.param({
            limit: -1,
            query: "TipoOrganizacion.CodigoAbreviacion:EB",
        })).then(function(response) {
          ctrl.chequera.bancos = response.data;
        });


      }

    };

    ctrl.obtenerSucursales = function(){
      ctrl.chequera.sucursales = [];
      if(!angular.isUndefined(ctrl.chequera.banco)){
        financieraMidRequest.get('gestion_sucursales/ListarSucursalesBanco/'+ctrl.chequera.banco.Id).then(function(response){
          if (response.data != null) {
              ctrl.chequera.sucursales = response.data;
          }
        });
      }

    }

    ctrl.consultarCuentas = function(){
      ctrl.chequera.cuentasBancarias = [];
      if (!angular.isUndefined(ctrl.chequera.sucursal)){
        financieraRequest.get('cuenta_bancaria',$.param({
          query:"Sucursal:"+ctrl.chequera.sucursal.OrganizacionHija.Id
        })).then(function(response){
          if (response.data != null && response.data.indexOf("no row found")<0) {
            ctrl.chequera.cuentasBancarias = response.data;
          }
        });
      }

    }

    ctrl.consultaResponsable = function(){
      ctrl.chequera.cargandoResponsable=true;
      agoraRequest.get('supervisor_contrato',$.param({
        query:"Documento:" + ctrl.chequera.numdocResponsable+",Cargo__icontains:tesorer",
        limit:-1
      })).then(function(response){
          if(!angular.isUndefined(response.data) && typeof(response.data) !== "string" && response.data !=null){
              ctrl.chequera.nombreResponsable = response.data[0].Nombre;
              ctrl.chequera.respEnc=true;
              ctrl.chequera.cargandoResponsable = false;
          }else{
            ctrl.chequera.nombreResponsable = $translate.instant('NO_ENCONTRADO');
            ctrl.chequera.cargandoResponsable = false;
            ctrl.chequera.respEnc=false;
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

      if(angular.isUndefined(ctrl.chequera.nombreResponsable)|| ctrl.chequera.nombreResponsable.length === 0){
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_RESP_NO_ENC") + "</li>";
          ctrl.respEnc=false;
      }

      if (ctrl.chequera.numCheques<=0){
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("VALOR_CHEQUE_INICIAL_MAYOR") + "</li>";
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
        var request = {
          Chequera:{
            UnidadEjecutora:ctrl.chequera.unidadejecutora.Id,
            Responsable:ctrl.chequera.numdocResponsable,
            Vigencia:ctrl.chequera.vigencia,
            Observaciones:ctrl.chequera.observaciones,
            NumeroChequeInicial:ctrl.chequera.numeroChequeInicial,
            NumeroChequeFinal:ctrl.chequera.numeroChequeFinal,
            CuentaBancaria:ctrl.chequera.cuentaBancaria,
            ChequesDisponibles:ctrl.chequera.numCheques
          },
          Usuario:111111
        }
        financieraMidRequest.post('gestion_cheques/CreateChequera',request).then(function(response){
          if (response.data.Type != undefined) {
              if (response.data.Type === "error") {
                  swal('', $translate.instant(response.data.Code), response.data.Type);
              } else {
                  var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
                  templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Chequera.Consecutivo + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
                  templateAlert = templateAlert + "</table>";
                  swal({title:'',
                        html:templateAlert,
                        type:response.data.Type
                  });
                  $('#creacionChequera').modal('hide');
                  ctrl.limpiarChequera();
                  ctrl.consultarChequeras(0,'');
              }
          }
        });
      }else{
        swal({ title:'¡Error!',
              html:'<ol align="left">'+ctrl.MensajesAlerta+'</ol>',
              type:'error'
          });
      }
    }
    $scope.$watch('[tesoreriaGestionChequera.chequera.numeroChequeInicial,tesoreriaGestionChequera.chequera.numeroChequeFinal]',function(newValue){
        ctrl.chequera.numCheques = ctrl.validarNum(newValue[1])-ctrl.validarNum(newValue[0]);
    },true);
    ctrl.validarNum = function(numero){
      if(angular.isUndefined(numero)) {
         numero = 0;
      }
      return numero;
    }
    ctrl.limpiarChequera = function(){
      $scope.chequera.$setPristine();
      ctrl.chequera = {};
      ctrl.chequera.respEnc=false;
      ctrl.chequera.numCheques = 0;
    }

    ctrl.cargarEstados = function() {
        financieraRequest.get("estado_chequera", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {

              $scope.estados = [];
              $scope.aristas = [];
              ctrl.estados = response.data;
              angular.forEach(ctrl.estados, function(estado) {
                  $scope.estados.push({
                      id: estado.NumeroOrden,
                      label: estado.Nombre
                  });
                  $scope.estado_select.push({
                      value: estado.NumeroOrden,
                      label: estado.Nombre,
                      estado: estado
                  });
              });

                $scope.aristas = [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 1,
                        to: 3
                    },
                    {
                        from: 2,
                        to: 4
                    }
                ];
            });
    };

    ctrl.cargarEstados();

    $scope.loadrow = function(row, operacion) {
        $scope.solicitud = row.entity;
        switch (operacion) {
            case "proceso":
                $scope.estado = $scope.solicitud.Estado ;
                $scope.informacion = $translate.instant('CHEQUERA')+ ' '+ 'No'+' '+row.entity.Consecutivo;
                $scope.mostrar_direc = true;
                break;
            default:
        }
    }

    $scope.funcion = function(element) {
        $scope.estadoclick = $localStorage.nodeclick;

        ctrl.Request = {
          ChequeraEstadoChequera:{Estado:$scope.estadoclick.estado,
                                  Usuario:111111,
                                  Activo:true
                                },
          Chequera:$scope.solicitud
        };
        ctrl.Request.Chequera.Responsable= ctrl.Request.Chequera.Responsable.Id;
        ctrl.Request.Chequera.UnidadEjecutora= ctrl.Request.Chequera.UnidadEjecutora.Id;
              financieraRequest.post('chequera_estado_chequera/AddEstadoChequera', ctrl.Request).then(function(response) {
                if(response.data.Type != undefined){
                  if(response.data.Type === "error"){
                      swal('',$translate.instant(response.data.Code),response.data.Type);
                    }else{
                      swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                        ctrl.consultarChequeras(0,'');
                        $scope.estado = $scope.estadoclick.estado;
                      })
                    }
                  }
                });
  }

  });
