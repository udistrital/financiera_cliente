'use strict';

describe('Directive: rubros/opNominaRubrosHomologadoPorRp', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rubros/op-nomina-rubros-homologado-por-rp></rubros/op-nomina-rubros-homologado-por-rp>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rubros/opNominaRubrosHomologadoPorRp directive');
  }));
});
