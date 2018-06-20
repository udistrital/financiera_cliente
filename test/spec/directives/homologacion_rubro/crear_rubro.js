'use strict';

describe('Directive: homologacionRubro/crearRubro', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<homologacion-rubro/crear-rubro></homologacion-rubro/crear-rubro>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the homologacionRubro/crearRubro directive');
  }));
});
