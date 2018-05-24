'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesParametrosActasCtrl
 * @description
 * # DevolucionesParametrosActasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesParametrosActasCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    $scope.botones=[
      {clase_color:"editar",clase_css:"fa fa-pencil fa-lg animated-hover",titulo:$translate.instant("BTN.EDITAR"),operacion:"editar",estado:true}
    ];
    ctrl.actas = {
        paginationPageSizes: [5, 15, 20],
        paginationPageSize: 5,
        enableFiltering: true,
        enableSorting: true,
        columnDefs:[{
                field: 'CodigoAbreviacion',
                displayName: $translate.instant('CODIGO_ABREVIACION'),
                width: '10%',
            },
            {
                field: 'Nombre',
                displayName: $translate.instant('NOMBRE'),
                width: '15%',
            },
            {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                width: '45%',
            },
            {
                field: 'Activo',
                displayName: $translate.instant('ACTIVO'),
                cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
                width: '10%',
            },
            {
                field: 'FechaRegistro',
                displayName: $translate.instant('FECHA'),
                cellFilter: "date:'yyyy-MM-dd'",
                width: '12%',
            },
            {
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '12%',
                cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
            }
        ]
    };
    ctrl.getParametros = function(){
      financieraRequest.get("acta_devolucion",$.param({
        limit:-1,
        sortby:"Id",
        order:"asc"
      })).then(function(response){
        ctrl.actas.data = response.data;
      });
    };

    ctrl.getParametros();

    $scope.loadrow = function(row, operacion) {
      ctrl.operacion = operacion;
      switch (operacion) {
          case "ver":
              ctrl.row_entity = row.entity;
              console.log(ctrl.row_entity);
              ctrl.get_requisito_tipo_avance(ctrl.row_entity.Id);
              $('#modalVer').modal('show');
              break;
          case "agregar":
              ctrl.CodigoAbreviacion = "";
              ctrl.Nombre = "";
              ctrl.Descripcion = "";
              $('#modalEdit').modal('show');
              break;
          case "editar":
              console.log(row.entity);
              ctrl.row_entity = row.entity
              ctrl.CodigoAbreviacion = row.entity.CodigoAbreviacion;
              ctrl.Nombre = row.entity.Nombre;
              ctrl.Descripcion = row.entity.Descripcion;
              ctrl.Activo = row.entity.Activo;
              ctrl.FechaRegistro = row.entity.FechaRegistro;
              $('#modalEdit').modal('show');
              break;
          case "config":

              break;
          default:
      }
    }

    ctrl.modalEdit=function(){
      ctrl.parameter={
        CodigoAbreviacion: ctrl.CodigoAbreviacion,
        Nombre: ctrl.Nombre,
        Descripcion: ctrl.Descripcion
      }
      console.log(ctrl.Activo);

      switch (ctrl.operacion){
        case "editar":
        ctrl.parameter.Id = ctrl.row_entity.Id;
        ctrl.parameter.FechaRegistro =  ctrl.row_entityFechaRegistro;
        ctrl.parameter.Activo= ctrl.Activo;
        financieraRequest.put("acta_devolucion", ctrl.parameter.Id, ctrl.parameter)
            .then(function(response) {
              console.log(response);
                if (response.statusText === "200") {
                    swal(
                        $translate.instant('ACTUALIZADO'),
                        ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                        'success'
                    );
                }
            });
        break;
        case "agregar":
        console.log("parametro agregar ",ctrl.parameter);
        ctrl.parameter.Activo = null;
        financieraRequest.post("acta_devolucion",ctrl.parameter)
            .then(function(response) {
              console.log(response);
                if (response.statusText === "Created") {
                    swal(
                        $translate.instant('CREADO'),
                        $translate.instant('REGISTRO_CORRECTO'),
                        'success'
                    );
                }
            });
        break;
        ctrl.getParametros();
      }
    }

  });
