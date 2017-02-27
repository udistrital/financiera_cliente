'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:iva/iva
 * @description
 * # iva/iva
 */
angular.module('financieraClienteApp')
  .directive('iva', function (financieraRequest) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */

      templateUrl: 'views/directives/iva/iva.html',
      controller:function($scope){
        var self = this;
        self.poder_crear_iva = false;
        self.categoria_selet = {};
        self.nuevo_iva = null;
        // grid
        $scope.gridIvaCategoria = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridIvaCategoria.columnDefs = [
          {
            name: 'Id',
            displayName: "Id",
          },
          {
            name: 'Nombre',
            displayName: "Nombre",
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: 'Operacion',
             enableFiltering: false,
            cellTemplate:
            '<button type="button" class="btn btn-danger btn-circle"><i class="fa fa-times"></i></button>'
          }
        ];
        //get categorias
        financieraRequest.get("categoria_iva",
          $.param({
            query:"estado_activo:True"
          })
        ).then(function(response) {
          self.categorias = response.data;
          $scope.gridIvaCategoria.data = response.data;
        });
        //get ivas de una categoria
        self.cargar_ivas = function(categoria){
          //console.log(categoria);
          self.categoria_selet = categoria;
          self.iva = {};
          financieraRequest.get("iva",
            $.param({
              query:"estado_activo:True,categoria_iva:"+categoria.Id,
            })
          ).then(function(response) {
            self.ivas = response.data;
          });
        };
        // get iva
        self.editar_iva=function(iva){
          self.ver_add_iva = !self.ver_add_iva ;
          self.iva = iva;
        }
        // add iva
        self.agregar_iva=function(){
          if(self.nuevo_iva){
            self.nuevo_iva.CategoriaIva = self.categoria_selet;
            self.nuevo_iva.EstadoActivo = true;
            financieraRequest.post("iva", self.nuevo_iva).then(function(response){
              self.cargar_ivas(self.categoria_selet)
              self.nuevo_iva=null;
            });

          }
        }
      },
      controllerAs:'d_iva'
    };
  });
