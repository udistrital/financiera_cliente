'use strict';

describe('Directive: nomina/liquidacion/verTodas', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nomina/liquidacion/ver-todas></nomina/liquidacion/ver-todas>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nomina/liquidacion/verTodas directive');
  }));
});
