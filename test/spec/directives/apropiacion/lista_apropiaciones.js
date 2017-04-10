'use strict';

describe('Directive: apropiacion/listaApropiaciones', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/lista-apropiaciones></apropiacion/lista-apropiaciones>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/listaApropiaciones directive');
  }));
});
