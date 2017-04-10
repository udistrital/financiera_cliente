'use strict';

describe('Directive: apropiacion/fuentesPorApropiacionesListar', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/fuentes-por-apropiaciones-listar></apropiacion/fuentes-por-apropiaciones-listar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/fuentesPorApropiacionesListar directive');
  }));
});
