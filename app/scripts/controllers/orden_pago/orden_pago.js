'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOrdenPagoCtrl
 * @description
 * # OrdenPagoOrdenPagoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoCtrl', function (financieraRequest, administrativaRequest,$scope, $location, $http, $window, goLink) {
    var view_path = "view_orden_pago_proveedor";
    var edit_path = "edit_orden_pago_proveedor";

    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
      if( col.filters[0].term ){
        return 'header-filtered';
      } else {
        return '';
      }
    };
    //
    financieraRequest.get("tipo_orden_pago", "")
      .then(function(response){
        $scope.tipo_orden_pago = response.data;
      });

    //
    $scope.gridOrdenesDePago = {
      enableFiltering: true,
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOrdenesDePago.columnDefs = [
      {
        name: 'Id',
        displayName: "Id",
      },
      {
        name: 'Vigencia',
        displayName: "Vigencia",
      },
      {
        name: 'RegistroPresupuestal',
        displayName: "Registro Presupuestal",
      },
      {
        name: 'UnidadEjecutora.Nombre',
        displayName: "Unidad Ejecutora",
      },
      {
        name: 'UnidadEjecutora.Entidad.Nombre',
        displayName: "Entidad",
      },
      {
        name: 'TipoOrdenPago.Nombre',
        displayName: "Tipo Orden",
        /*filter:{
           term: '1',
           type: uiGridConstants.filter.SELECT,
           selectOptions: $scope.tipo_orden_pago
        }*/
      },
      {
        name: 'EstadoOrdenPago.Nombre',
        displayName: "Estado",
      },
      {
        //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
        name: 'Operacion',
         enableFiltering: false,
        cellTemplate:
        '<button type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.goWithOrdenesDePago(row' + ',\'' + view_path + '\')"> <i class="glyphicon glyphicon-eye-open"></i></button>\
         <button type="button" class="btn btn-info btn-circle"   ng-click="grid.appScope.goWithOrdenesDePago(row' + ',\'' + edit_path + '\')">  <i class="glyphicon glyphicon-pencil"></i></button>\
         <button ng-click="grid.appScope.deleteOrdenDePago(row)" type="button" class="btn btn-danger btn-circle"><i class="fa fa-times"></i></button>'

      }
    ];
    // function link
    $scope.go = function(path){
      $location.url(path);
    };
    $scope.go_with_parameter = function(path, parameter){
      $location.url(path + parameter);
    };
    $scope.goWithOrdenesDePago = function(row, path){
      console.log(row)
      console.log(path)
      var Id = row.entity.Id;
      $scope.go_with_parameter( path + "/", Id);
    }
    //
    $scope.deleteRow = function(row) {
      var index = $scope.gridOptions.data.indexOf(row.entity);
      $scope.gridOptions.data.splice(index, 1);
    };
    //
    $scope.deleteOrdenDePago = function(orden){
       $http.delete(api_path02 + "ordenes_de_pago/" + orden.entity.Id, orden)
            .then(function (data, status, header) {
                $window.location.reload();
            })
            .catch(function (data, status, header, config) {
                $scope.ServerResponse =  status  + "----" + header + "----" + data;
                console.log(status  + "----" + header + "----" + data + '----' + config)
            });
    }
    //
    financieraRequest.get("orden_pago", $.param({limit:0 }) )
      .then(function(response){
        $scope.gridOrdenesDePago.data = response.data;
      });
  //

  //
  });
