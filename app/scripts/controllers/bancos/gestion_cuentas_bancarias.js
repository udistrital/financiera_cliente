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
          field: 'EstadoActivo',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

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
    };
    financieraMidRequest.get('cuentas_bancarias', $.param({
        limit: -1
      })).then(function(response) {
        ctrl.CuentasBancarias.data = response.data;
      });

    $scope.loadrow = function(row, operacion) {
        ctrl.operacion = operacion;
        switch (operacion) {
            case "editar_cuenta_bancaria":
                  ctrl.mostrar_modal_edicion_cuenta_bancaria(row);
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
        ctrl.cuentaBancariaEditar = row.entity;
        ctrl.consultaSuc = financieraMidRequest.get('gestion_sucursales/ListarSoloSucursalesBanco/'+ctrl.cuentaBancariaEditar.Banco.Id).then(function(response){
          if (response.data != null) {
              ctrl.sucursales = response.data;
          }
        });
        $q.all([ctrl.consultaSuc]).then(function(){
          $("#modal_editar_cuenta_bancaria").modal("show");
        });
    }

    ctrl.mostrar_modal_agregar_cuenta_bancaria = function(row){
          financieraRequest.get('tipo_cuenta_bancaria', $.param({
                limit: -1
              })).then(function(response) {
                ctrl.TipoCuentaBancaria = response.data;
              });


            $("#modal_agregar_cuenta_bancaria").modal("show");

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
        ctrl.formPresente = 'cuentas_contables'
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
    }

    ctrl.consultarListas();

    ctrl.agregar_cuenta_bancaria = function(row){
      if(ctrl.cuentaBancariaEditar.CuentaContable === undefined){
        swal({
            html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#449D44",
            confirmButtonText: $translate.instant('VOLVER'),
        })
      } else{

        var objeto_tipo_cuenta = JSON.parse(ctrl.selectTipoCuenta)

        var informacion_cuenta_bancaria = {
          Nombre  :    ctrl.agregar_nombre_cuenta_bancaria,
          NumeroCuenta  : (ctrl.agregar_numero_cuenta_bancaria).toString(),
          EstadoActivo  :  Boolean(true),
          Saldo  : 0,
          TipoCuentaBancaria : { Id: objeto_tipo_cuenta.Id},
          TipoRecurso : {Id: 1},
          Sucursal  : ctrl.SucursalSeleccionada.Id,
          UnidadEjecutora : {Id: 1},
          CuentaContable: {Id: ctrl.CuentaContableSeleccionada.Id}
      }

        financieraRequest.post('cuenta_bancaria', informacion_cuenta_bancaria).then(function(response) {

            if (typeof(response.data) == "object") {
                swal({
                    html: $translate.instant('INFORMACION_REG_CORRECTO'),
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#449D44",
                    confirmButtonText: $translate.instant('VOLVER'),
                }).then(function() {
                    $('#modal_agregar_cuenta_bancaria').modal('hide');
                    $window.location.reload()
                })

            }
            if (typeof(response.data) == "string") {
                swal({
                    html: $translate.instant('INFORMACION_REG_INCORRECTO'),
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#449D44",
                    confirmButtonText: $translate.instant('VOLVER'),
                }).then(function() {
                    $('#modal_agregar_cuenta_bancaria').modal('hide');
                    $window.location.reload()
                })

            }
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
                    $("#modal_editar_cuenta_bancaria").modal("hide");
                }
          })
          });
      }
    };

  });
