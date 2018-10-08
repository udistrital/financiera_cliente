'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudGestionSubtipoCtrl
 * @description
 * # TesoreriaAvancesSolicitudGestionSubtipoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionSubtipoAvanceLegCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    ctrl.hayData = true;
    ctrl.cargando = true;
    var emptyData = [];
    ctrl.parameter={};
    $scope.botones=[
      {clase_color:"editar",clase_css:"fa fa-pencil fa-lg animated-hover",titulo:$translate.instant("BTN.EDITAR"),operacion:"editar",estado:true},
      {clase_color:"borrar",clase_css:"fa fa-trash fa-lg animated-hover",titulo:$translate.instant("BTN.BORRAR"),operacion:"eliminar",estado:true}
    ];

    ctrl.parameters = {
        paginationPageSizes: [5, 15, 20],
        paginationPageSize: 5,
        enableFiltering: true,
        enableSorting: true,
        columnDefs:[{
                field: 'CodigoAbreviacion',
                displayName: $translate.instant('CODIGO_ABREVIACION'),
                width: '10%',
                cellClass: 'input_center',
                headerCellClass:'encabezado'
            },
            {
                field: 'Nombre',
                displayName: $translate.instant('NOMBRE'),
                width: '15%',
                cellClass: 'input_center',
                headerCellClass:'encabezado'
            },
            {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                width: '50%',
                cellClass: 'input_center',
                headerCellClass:'encabezado'
            },
            {
                field: 'Activo',
                displayName: $translate.instant('ACTIVO'),
                cellTemplate: '<div class="middle"><md-checkbox aria-label="activo" ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                width: '10%',
                cellClass: 'input_center',
                headerCellClass:'encabezado'
            },
            {
                field: 'AplicaEntradaAlmacen',
                displayName: $translate.instant('ENTRADA_ALMACEN'),
                cellTemplate: '<div class="middle"><md-checkbox aria-label="activo" ng-disabled="true" ng-model="row.entity.AplicaEntradaAlmacen" class="blue"></md-checkbox></div>',
                width: '10%',
                cellClass: 'input_center',
                headerCellClass:'encabezado'
            },
            {
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '5%',
                cellClass: 'input_center',
                cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
                headerCellClass:'encabezado'
            }
        ],
        onRegisterApi: function(gridApi){ $scope.gridApi = gridApi;}
    };
    ctrl.getParametros = function(){
      financieraRequest.get('avance_legalizacion_sub_tipo',$.param({
        limit:-1,
        sortby:"Id",
        order:"asc"
      })).then(function(response){
        if (response.data===null) {
          ctrl.hayData = false;
          ctrl.cargando = false;
          ctrl.parameters.data = emptyData;
        }else{
          ctrl.parameters.data = response.data;
          ctrl.hayData = true;
          ctrl.cargando = false;
        }
      });
    };

    ctrl.getParametros();



    $scope.loadrow = function(row, operacion) {
      ctrl.operacion = operacion;
      switch (operacion) {
          case "eliminar":
              ctrl.row_entity = row.entity;
              ctrl.eliminar();
              break;
          case "agregar":
              ctrl.parameter = {};
              $('#modalEdit').modal('show');
              break;
          case "editar":
              ctrl.row_entity = row.entity
              ctrl.parameter.CodigoAbreviacion = row.entity.CodigoAbreviacion;
              ctrl.parameter.Nombre = row.entity.Nombre;
              ctrl.parameter.Descripcion = row.entity.Descripcion;
              ctrl.parameter.Activo = row.entity.Activo;
              ctrl.parameter.FechaRegistro = row.entity.FechaRegistro;
              $('#modalEdit').modal('show');
              break;
          default:
      }
    };

    ctrl.validateFields = function(){


      if($scope.avances_add_edit.$invalid){
        angular.forEach($scope.avances_add_edit.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });

        swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
        return false;
      }

    };


    ctrl.eliminar = function() {
        swal({
            title: $translate.instant('BTN.CONFIRMAR'),
            html: $translate.instant('ELIMINARA') + ' ' +$translate.instant('TITULO') +' '+'<div><b>'+ctrl.row_entity.Nombre+'</b></div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: $translate.instant('BTN.BORRAR'),
            cancelButtonText:$translate.instant('BTN.CANCELAR')
        }).then(function() {
            financieraRequest.delete($scope.nombreparametro, ctrl.row_entity.Id)
                .then(function(response) {
                    if (response.data === "OK") {
                        swal(
                            $translate.instant('ELIMINADO'),
                            ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ELIMINADO'),
                            'success'
                        );
                          ctrl.getParametros();
                    }else{
                      swal(
                          $translate.instant('ERROR_ELIMINAR'),
                          ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('E_04566'),
                          'error'
                      );
                    }
                });
        })
    };

    ctrl.modalEdit=function(){

      var validar_campos = ctrl.validateFields();


      if(validar_campos != false){
      if($scope.nombreparametro==="documento"&& $scope.nombreservicio ==="coreRequest"){
        ctrl.parameter.TipoDocumento = {Id:5};
      }
      switch (ctrl.operacion){
        case "editar":
        ctrl.parameter.Id = ctrl.row_entity.Id;
        ctrl.parameter.FechaRegistro =  ctrl.row_entityFechaRegistro;
        ctrl.parameter.Activo= ctrl.Activo;
        financieraRequest.put($scope.nombreparametro, ctrl.parameter.Id, ctrl.parameter)
            .then(function(response) {
                if (response.status === 200) {
                    swal(
                        $translate.instant('ACTUALIZADO'),
                        ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                        'success'
                    );
                    ctrl.getParametros();
                }
            });
        break;
        case "agregar":
        ctrl.parameter.Activo = true;
        financieraRequest.post('avance_legalizacion_sub_tipo',ctrl.parameter)
            .then(function(response) {
                if (response.statusText === "Created") {
                    swal(
                        $translate.instant('CREADO'),
                        $translate.instant('REGISTRO_CORRECTO'),
                        'success'
                    );
                    ctrl.getParametros();
                }
            });
        break;
      }
      $('#modalEdit').modal('hide');
    }
  };

  ctrl.reset = function (){

    ctrl.parameter.CodigoAbreviacion = "";
    ctrl.parameter.Nombre = "";
    ctrl.parameter.Descripcion = "";
    ctrl.parameter.Activo = "";
    ctrl.parameter.FechaRegistro = "";
  };
  });
