'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionCuentasBancariasCtrl
 * @description
 * # BancosGestionCuentasBancariasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionCuentasBancariasCtrl', function(organizacionRequest, financieraRequest, $scope, $translate, $window,uiGridConstants) {
    var ctrl = this;

    ctrl.formPresente = 'datos_basicos';

    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'editar_cuenta_bancaria', estado: true },

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
          field: 'Sucursal',
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


    ctrl.CuentaContable = {
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
        {
          field: 'Naturaleza',
          displayName: $translate.instant('NATURALEZA'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        {
          field: 'Codigo',
          displayName: $translate.instant('CODIGO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',

        },
        ]
    };

    ctrl.CuentaContable.multiSelect = false;
    ctrl.CuentaContable.modifierKeysToMultiSelect = false;
    ctrl.CuentaContable.enablePaginationControls = true;
    ctrl.CuentaContable.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {

        if(row.isSelected === false){
          ctrl.CuentaContableSeleccionada = undefined;
        }else{
            ctrl.CuentaContableSeleccionada = row.entity
        }
      
      });
    };


    financieraRequest.get('cuenta_bancaria', $.param({
        limit: -1
      })).then(function(response) {

        angular.forEach(response.data, function(data){
          organizacionRequest.get('organizacion/', $.param({
              limit: -1,
              query: "TipoOrganizacion.CodigoAbreviacion:SU,Id:"+data.Sucursal,
          })).then(function(response) {
              if (response.data == null) {
                    data.Sucursal = "No asignado";
              } else {
                  data.Sucursal = response.data[0].Nombre;
              }

          });
        });

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


    ctrl.mostrar_modal_edicion_cuenta_bancaria = function(row){
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

        financieraRequest.get('tipo_cuenta_bancaria', $.param({
            limit: -1
          })).then(function(response) {
            ctrl.TipoCuentaBancaria = response.data;
          });

        financieraRequest.get('cuenta_contable', $.param({
              limit: -1
            })).then(function(response) {
              ctrl.CuentaContable.data = response.data;
            });

        $("#modal_editar_cuenta_bancaria").modal("show");
    };

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

      if(ctrl.SucursalSeleccionada === undefined){
        swal({
            html: $translate.instant('ALERTA_COMPLETAR_DATOS'),
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#449D44",
            confirmButtonText: $translate.instant('VOLVER'),
        })
      } else{
        financieraRequest.get('cuenta_contable', $.param({
              limit: -1
            })).then(function(response) {
          ctrl.CuentaContable.data = response.data;
        });

        ctrl.formPresente = 'cuentas_contables'

      }


    };

    ctrl.mostrar_datos_basicos = function(){
      ctrl.formPresente = 'datos_basicos'
    };

    ctrl.agregar_cuenta_bancaria = function(row){
      if(ctrl.CuentaContableSeleccionada === undefined){
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
          alert("editar cuenta_bancaria");
    };

  });
