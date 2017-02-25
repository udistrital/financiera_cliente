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
      controller:function(){
        var self = this;

        financieraRequest.get("categoria_iva",
          $.param({
            query:"estado_activo:True"
          })
        ).then(function(response) {
          self.categorias = response.data;
        });

        //get ivas de una categoria
        self.cargar_ivas = function(categoria_id){
          console.log(categoria_id)
          financieraRequest.get("iva",
            $.param({
              query:"estado_activo:True,categoria_iva:"+categoria_id,
            })
          ).then(function(response) {
            self.ivas = response.data;
          });
        };

      },
      controllerAs:'d_iva'
    };
  });
