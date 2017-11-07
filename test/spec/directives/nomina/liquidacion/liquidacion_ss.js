'use strict';

describe('Directive: nomina/liquidacion/liquidacionSs', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nomina/liquidacion/liquidacion-ss></nomina/liquidacion/liquidacion-ss>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nomina/liquidacion/liquidacionSs directive');
  }));
});
