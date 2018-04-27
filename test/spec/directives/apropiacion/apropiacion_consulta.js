'use strict';

describe('Directive: apropiacion/apropiacionConsulta', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/apropiacion-consulta></apropiacion/apropiacion-consulta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/apropiacionConsulta directive');
  }));
});
