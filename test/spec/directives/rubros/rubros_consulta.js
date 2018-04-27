'use strict';

describe('Directive: rubros/rubrosConsulta', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rubros/rubros-consulta></rubros/rubros-consulta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rubros/rubrosConsulta directive');
  }));
});
