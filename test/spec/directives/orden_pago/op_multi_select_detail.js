'use strict';

describe('Directive: ordenPago/opMultiSelectDetail', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orden-pago/op-multi-select-detail></orden-pago/op-multi-select-detail>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ordenPago/opMultiSelectDetail directive');
  }));
});
