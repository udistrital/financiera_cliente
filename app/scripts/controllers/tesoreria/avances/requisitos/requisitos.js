      'use strict';

      /**
      * @ngdoc function
      * @name financieraClienteApp.controller:TesoreriaAvancesRequisitosRequisitosCtrl
      * @description
      * # TesoreriaAvancesRequisitosRequisitosCtrl
      * Controller of the financieraClienteApp
      */
      angular.module('financieraClienteApp')
      .controller('RequisitosCtrl', function($scope, financieraRequest, $translate) {
        var ctrl = this;
        ctrl.operacion = "";
        ctrl.row_entity = {};
        ctrl.row_entity = {};
        ctrl.hayData = true;
        ctrl.cargando = true;
        $scope.botones = [
          { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
          { clase_color: "borrar", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'delete', estado: true }
        ];
        ctrl.gridOptions = {
          paginationPageSizes: [5, 15, 20],
          paginationPageSize: 5,
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          columnDefs: [{
            field: 'Id',
            visible: false
          },
          {
            field: 'CodigoAbreviacion',
            displayName: $translate.instant('CODIGO_ABREVIACION'),
            width: '10%',
            cellClass: 'input_center',
            headerCellClass: 'encabezado'
          },
          {
            field: 'Nombre',
            displayName: $translate.instant('NOMBRE'),
            width: '20%',
            headerCellClass: 'encabezado',
          },
          {
            field: 'Descripcion',
            displayName: $translate.instant('DESCRIPCION'),
            width: '37%',
            headerCellClass: 'encabezado',
          },
          {
            field: 'Activo',
            displayName: $translate.instant('ACTIVO'),
            cellTemplate: '<div class="middle"><md-checkbox ng-disabled="true" ng-model="row.entity.Activo" class="blue"></md-checkbox></div>',
            width: '6%',
            cellClass: 'input_center',
            headerCellClass: 'encabezado'
          },
          {
            field: 'Etapa.Nombre',
            displayName: $translate.instant('ETAPA'),
            cellTemplate: '<div align="center">{{row.entity.EtapaAvance.Nombre}}</div>',
            width: '9%',
            cellClass: 'input_center',
            headerCellClass: 'encabezado'
          },
          {
            field: 'FechaRegistro',
            displayName: $translate.instant('FECHA_REGISTRO'),
            cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span></div>',
            width: '10%',
            cellClass: 'input_center',
            headerCellClass: 'encabezado'
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: $translate.instant('OPCIONES'),
            enableFiltering: false,
            width: '8%',
            cellClass: 'input_center',
            headerCellClass: 'encabezado',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
        ]
      };

      ctrl.gridOptions.multiSelect = false;
      ctrl.get_all_avances = function() {

        financieraRequest.get("etapa_avance", $.param({
          limit: -1,
          query: "Activo:1",
          sortby: "NumeroOrden",
          order: "asc"
        }))
        .then(function(response) {
          ctrl.etapas = response.data;
          console.log(ctrl.etapas);
        });

        financieraRequest.get("requisito_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          if(response.data === null){
            ctrl.hayData = false;
            ctrl.cargando = false;
          }else{
            ctrl.hayData = true;
            ctrl.cargando = false;
            ctrl.gridOptions.data = response.data;
          }

        });
      };

      ctrl.gridOptions.onRegisterApi = function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function() {});
      };

      ctrl.get_all_avances();

      $scope.loadrow = function(row, operacion) {
        ctrl.row_entity = row.entity;
        ctrl.operacion = operacion;
        switch (operacion) {
          case "add":
          $('#myModal').modal('show');
          break;
          case "edit":
          $('#myModal').modal('show');
          break;
          case "delete":
          ctrl.delete_requisito();
          break;
        }
      };

      ctrl.delete_requisito = function() {
        swal({
          title: $translate.instant('BTN.CONFIRMAR'),
          text: $translate.instant('ELIMINARA') + ' ' + ctrl.row_entity.CodigoAbreviacion,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: $translate.instant('BTN.BORRAR')
        }).then(function() {
          financieraRequest.delete("requisito_avance", ctrl.row_entity.Id)
          .then(function(response) {
            if (response.status === 200) {
              swal(
                $translate.instant('ELIMINADO'),
                ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ELIMINADO'),
                'success'
              );
              ctrl.get_all_avances();
            }
          });
        })

      };

      ctrl.add_edit = function() {
        var data = {};

        var validar_campos = ctrl.validateFields();


        if(validar_campos != false){
          switch (ctrl.operacion) {
            case 'edit':

            data = {
              Id: ctrl.row_entity.Id,
              CodigoAbreviacion: ctrl.row_entity.CodigoAbreviacion,
              Nombre: ctrl.row_entity.Nombre,
              Descripcion: ctrl.row_entity.Descripcion,
              Activo: ctrl.row_entity.Activo,
              EtapaAvance: ctrl.row_entity.EtapaAvance,
              FechaRegistro: ctrl.row_entity.FechaRegistro
            };


            financieraRequest.put("requisito_avance", data.Id, data)
            .then(function(info) {
              if (info.data === "OK") {
                  swal(
                      $translate.instant('ACTUALIZADO'),
                      ctrl.row_entity.CodigoAbreviacion + ' ' + $translate.instant('FUE_ACTUALIZADO'),
                      'success'
                  );
                  ctrl.row_entity = {};
                  $("#myModal").modal('hide');
                  ctrl.get_all_avances();
              }else{
                swal("Error", $translate.instant("E_0459"),"error");
                ctrl.row_entity = {};
                $("#myModal").modal('hide');
                ctrl.get_all_avances();
              }
            });
            break;
            case 'add':

            var objeto_etapa_avance = JSON.parse(JSON.stringify(ctrl.selectTipoAvance));
            var etapa_avance = {
              Id: objeto_etapa_avance.Id
            };

            data = {
              CodigoAbreviacion: ctrl.row_entity.CodigoAbreviacion,
              Nombre: ctrl.row_entity.Nombre,
              Descripcion: ctrl.row_entity.Descripcion,
              EtapaAvance: etapa_avance
            };


            financieraRequest.post("requisito_avance", data)
            .then(function(info) {
              if (info.status === 201) {

                var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CODIGO_ABREVIACION') + "</th><th>" + $translate.instant('NOMBRE') + "</th><th>" + $translate.instant('DESCRIPCION') + "</th><th>" + $translate.instant('ETAPA') + "</th>";
                templateAlert = templateAlert + "<tr class='success'><td>" + data.CodigoAbreviacion + "</td>" + "<td>" + data.Nombre + "</td>"+ "<td>" +  data.Descripcion + "</td><td>" +  objeto_etapa_avance.Nombre + "</td></tr>" ;
                templateAlert = templateAlert + "</table>";

                swal($translate.instant('INFORMACION_REG_CORRECTO'), templateAlert, 'success').then(function(){
                  ctrl.row_entity = {};
                  $("#myModal").modal('hide');
                  ctrl.get_all_avances();
                });
              }else{
                console.log("info",info)
                swal("Error", $translate.instant("E_0459"),"error");
                ctrl.row_entity = {};
                $("#myModal").modal('hide');
                ctrl.get_all_avances();
              }
              //  ctrl.get_all_avances();
            });
            break;
            default:
          }


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

      ctrl.reset = function (){
        console.log(ctrl.selectTipoAvance)
        ctrl.row_entity.CodigoAbreviacion = "";
        ctrl.row_entity.Nombre = "";
        ctrl.row_entity.Descripcion = "";
        ctrl.row_entity.EtapaAvance = {};
        ctrl.selectTipoAvance = {};
          console.log(ctrl.selectTipoAvance)
      };
      });
