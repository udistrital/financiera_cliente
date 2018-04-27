'use strict';

describe('Directive: conceptos/verConcepto', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<conceptos/ver-concepto></conceptos/ver-concepto>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the conceptos/verConcepto directive');
  }));
});
