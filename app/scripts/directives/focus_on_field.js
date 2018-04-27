'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:focusOnField
 * @description
 * # focusOnField
 */
angular.module('financieraClienteApp')
  .directive('focusOnField', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {
          elem.on('submit', function () {
            elem.find('.ng-invalid:visible').first().focus();
          });
        }
      }
  });
