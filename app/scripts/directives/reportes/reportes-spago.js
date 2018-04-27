'use strict';

/**
* @ngdoc directive
* @name financieraClienteApp.directive:reportes/reportesSpago
* @description
* # reportes/reportesSpago
*/
angular.module('financieraClienteApp')
.directive('reportesSpago', function () {
  return {
    restrict: 'E',
    scope:{
      intputreporte: "="
    },
    //templateUrl: 'views/directives/reportes/reportes-spago.html',
    template: '<div id="frame"></div>',
    controller:function($scope, $localStorage){

      var sbi = Sbi.sdk;

      sbi.services.setBaseUrl({
        protocol: 'https'
        , host: 'intelligentia.udistrital.edu.co'
        , port: '8443'
        , contextPath: 'SpagoBI'
        , controllerPath: 'servlet/AdapterHTTP'
      });

      $scope.$watch('intputreporte', function() {
        if ($scope.intputreporte !== undefined && $scope.intputreporte.length !== 0) {
          function execTest() {
            var html = sbi.api.getDocumentHtml({
              documentLabel: $scope.intputreporte,
              executionRole: '/spagobi/user/admin',
              displayToolbar: false
              , displaySliders: false,
              iframe: {
                id: 'frame-reporte',
                width: '100%',
                border: '0px',
                height: '500px;'
              },
              newSesion: true
            });
            console.log(html);
            $('#frame').html('');
            $('#frame').append(html)
          }

          var cb = function (result, args, success) {
            if(success === true) {
              execTest();
            }
          }

          sbi.api.authenticate({
            params: {
              user: 'biconsulta'
              , password: 'biconsulta'
            }
            , callback: {
              fn: cb
              , scope: this
              //, args: {arg1: 'A', arg2: 'B', ...}
            }
          });
        }
      });

    },
    controllerAs:'d_reportes/reportesSpago'
  };
});
