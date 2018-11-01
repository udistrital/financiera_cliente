'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionCuentasBancariasCtrl
 * @description
 * # BancosGestionCuentasBancariasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionCuentasBancariasCtrl', function(organizacionRequest, financieraMidRequest,financieraRequest, $scope, $translate, $window,uiGridConstants,$q) {
    var ctrl = this;

    ctrl.formPresente = 'datos_basicos';



    $scope.btnagregar=$translate.instant('BTN.AGREGAR');

    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar_cuenta_bancaria', estado: true },
      {clase_color:"borrar",clase_css:"fa fa-trash fa-lg animated-hover",titulo:$translate.instant("BTN.BORRAR"),operacion:"eliminar",estado:true}

    ];


    ctrl.CuentasBancarias = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [
        {
          field: 'Id',
          visible:false,

        },
        {
          field: 'CuentaContable.Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'NumeroCuenta',
          displayName: $translate.instant('NUMERO_CUENTA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          name: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTemplate:'<div ng-if="row.entity.EstadoActivo">{{"ACTIVO"|translate}}</div><div ng-if="!row.entity.EstadoActivo">{{"INACTIVO"|translate}}</div>',

        },
        {
          field: 'TipoCuentaBancaria.Nombre',
          displayName: $translate.instant('TIPO_CUENTA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Sucursal.Nombre',
          displayName: $translate.instant('SUCURSAL'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'CuentaContable.Codigo',
          displayName: $translate.instant('CUENTA_CONTABLE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
            field: 'Opciones',
            displayName: $translate.instant('OPCIONES'),
            cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
            headerCellClass: 'text-info'
        }
      ]
    };

    ctrl.CuentasBancarias.multiSelect = false;
    ctrl.CuentasBancarias.modifierKeysToMultiSelect = false;
    ctrl.CuentasBancarias.enablePaginationControls = true;
    ctrl.CuentasBancarias.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
       //hacer algo al seleccionar
      });
    };

    ctrl.Sucursales = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Id',
          visible:false,

        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        ]
    };

    ctrl.Sucursales.multiSelect = false;
    ctrl.Sucursales.modifierKeysToMultiSelect = false;
    ctrl.Sucursales.enablePaginationControls = true;
    ctrl.Sucursales.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {

           if(row.isSelected === false){
             ctrl.SucursalSeleccionada = undefined;
           }else{
             ctrl.SucursalSeleccionada = row.entity;
           }


      });
    }

    ctrl.cargarBancos = function(){
      financieraMidRequest.get('cuentas_bancarias', $.param({
          limit: -1
        })).then(function(response) {
          ctrl.CuentasBancarias.data = response.data;
        });
    }

    ctrl.cargarBancos();

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "editar_cuenta_bancaria":
                  ctrl.mostrar_modal_edicion_cuenta_bancaria(row);
                break;
            case "eliminar":
                ctrl.deleteCuentaContable(row.entity);
                break;
            case "otro":
                break;
          default:
        }
    };

    ctrl.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        ctrl.plan_maestro = response.data[0];
      });
    };
    ctrl.cargar_plan_maestro();

    ctrl.mostrar_modal_edicion_cuenta_bancaria = function(row){
      ctrl.cuentaBancariaEditar = {};
        angular.extend(ctrl.cuentaBancariaEditar ,row.entity);
        ctrl.banco = ctrl.cuentaBancariaEditar.Banco;
        ctrl.consultaSuc = financieraMidRequest.get('gestion_sucursales/ListarSoloSucursalesBanco/'+ctrl.banco.Id).then(function(response){
          if (response.data != null) {
              ctrl.sucursales = response.data;
          }
        });
        $q.all([ctrl.consultaSuc]).then(function(){
          ctrl.forma = "editar";
          $("#modal_editar_cuenta_bancaria").modal("show");
        });
    }

    ctrl.mostrar_modal_agregar_cuenta_bancaria = function(row){
          ctrl.getTipoCuenta = financieraRequest.get('tipo_cuenta_bancaria', $.param({
                limit: -1
              })).then(function(response) {
                ctrl.TipoCuentaBancaria = response.data;
              });
              $q.all([ctrl.getTipoCuenta]).then(function(){
                ctrl.forma = "crear";
                ctrl.cuentaCrear = {};
                ctrl.cuentaCrear.Saldo=0;
                $("#modal_agregar_cuenta_bancaria").modal("show");
              });

    };

    ctrl.camposObligatorios = function() {
      var respuesta;
      ctrl.MensajesAlerta = '';

      switch (ctrl.forma) {
          case "editar":
                $scope.form = $scope.formplanEdit;
              break;
          case "crear":
                $scope.form = $scope.formplanCrear;
              break;
        default:
      }

      if($scope.form.$invalid){
        angular.forEach($scope.form.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
      }

      if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
    };

    ctrl.mostrar_sucursales = function(){
      ctrl.SucursalSeleccionada = undefined;
      if(ctrl.agregar_nombre_cuenta_bancaria && ctrl.agregar_numero_cuenta_bancaria && ctrl.selectTipoCuenta){
        organizacionRequest.get('organizacion/', $.param({
            limit: -1,
            query: "TipoOrganizacion.CodigoAbreviacion:SU",
        })).then(function(response) {
            if (response.data == null) {
                //PONER MARCA DE AGUA DE QUE NO HAY
            } else {
                ctrl.Sucursales.data = response.data;
            }

        });

        ctrl.formPresente = 'sucursales';

      }else{
        swal({
            html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#449D44",
            confirmButtonText: $translate.instant('VOLVER'),
        })
      }

    };

    ctrl.mostrar_cuentas_contables = function(){
      if(!ctrl.camposObligatorios()){
        swal({ title:'¡Error!',
              html:'<ol align="left">'+ctrl.MensajesAlerta+'</ol>',
              type:'error'
          });
        return
      }
        ctrl.alreadySel = true;
        ctrl.formPresente = 'cuentas_contables'
        ctrl.banco = undefined;
    }

    ctrl.mostrar_datos_basicos = function(){
      ctrl.formPresente = 'datos_basicos'
    };

    ctrl.obtenerSucursales = function(){
      ctrl.sucursales = [];
      if(!angular.isUndefined(ctrl.banco)){
        financieraMidRequest.get('gestion_sucursales/ListarSoloSucursalesBanco/'+ctrl.banco.Id).then(function(response){
          if (response.data != null) {
              ctrl.sucursales = response.data;
          }
        });
      }
    }

    ctrl.consultarListas = function(){
        organizacionRequest.get('organizacion/', $.param({
            limit: -1,
            query: "TipoOrganizacion.CodigoAbreviacion:EB",
        })).then(function(response) {
          ctrl.bancos = response.data;
        });

        financieraRequest.get('tipo_cuenta_bancaria',
          $.param({
            limit:'-1'
          })
        ).then(function(response){
          ctrl.TiposCuentaBancaria = response.data;
        });

        financieraRequest.get('unidad_ejecutora', $.param({
            limit: -1
        })).then(function(response) {
            ctrl.unidadesejecutoras = response.data;
        });

        financieraRequest.get('tipo_recurso', $.param({
            limit: -1
        })).then(function(response) {
            ctrl.tiposRecurso = response.data;
        });

    }

    ctrl.consultarListas();

    ctrl.agregar_cuenta_bancaria = function(row){
      var templateAlert;
      if(ctrl.cuentaCrear.CuentaContable === undefined){
        swal({
            html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#449D44",
            confirmButtonText: $translate.instant('VOLVER'),
        })
      } else{
      ctrl.cuentaCrear.NumeroCuenta  = ctrl.cuentaCrear.NumeroCuenta.toString();
      ctrl.cuentaCrear.EstadoActivo = true;
      ctrl.cuentaCrear.Sucursal = ctrl.cuentaCrear.Sucursal.Id;
      ctrl.alreadySel = false;
        financieraRequest.post('cuenta_bancaria',ctrl.cuentaCrear).then(function(response) {
            if(response.data.Type === "success"){
              templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('NUMERO_CUENTA') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.NumeroCuenta + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
              templateAlert = templateAlert + "</table>";
              ctrl.cargarBancos();
            }else{
              templateAlert=$translate.instant(response.data.Code);
            }
              swal('',templateAlert,response.data.Type).then(function(){
                if(response.data.Type === "success"){
                  $('#modal_agregar_cuenta_bancaria').modal('hide');
                  ctrl.cargarBancos();
                }
              });
        });

      }
    };

    ctrl.editar_cuenta_bancaria = function(row){
      if(ctrl.cuentaBancariaEditar.CuentaContable === undefined){
        swal({
            html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#449D44",
            confirmButtonText: $translate.instant('VOLVER'),
        })
      } else{
        ctrl.cuentaBancariaEditar.Sucursal = ctrl.cuentaBancariaEditar.Sucursal.Id;
        financieraRequest.put('cuenta_bancaria', ctrl.cuentaBancariaEditar.Id,ctrl.cuentaBancariaEditar).then(function(response) {
          swal("",$translate.instant(response.data.Code),response.data.Type).then(function() {
                if(response.data.Type==="success"){
                    ctrl.cargarBancos();
                    $("#modal_editar_cuenta_bancaria").modal("hide");
                    ctrl.alreadySel = false;
                }
          })
          });
      }
    }

    ctrl.deleteCuentaContable = function(row) {
      swal({
        title: $translate.instant('BTN.CONFIRMAR'),
        text: $translate.instant('ELIMINARA') + ' ' + row.NumeroCuenta,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('BTN.BORRAR')
      }).then(function() {
        row.EstadoActivo = false;
        row.Sucursal = row.Sucursal.Id;
        financieraRequest.put('cuenta_bancaria', row.Id,row).then(function(response) {
                if(response.data.Type==="success"){
                  $("#modal_editar_cuenta_bancaria").modal("hide");
                  swal( $translate.instant('ELIMINADO'),
                    row.NumeroCuenta + ' ' + $translate.instant('FUE_ELIMINADO'),
                    'success');
                }else{
                  swal("Error", $translate.instant(response.data.Code),response.data.Type);
                }
          });
      });
    }

  });
