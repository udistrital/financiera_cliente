'use strict';

describe('Directive: tesoreria/reintegros', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tesoreria/reintegros></tesoreria/reintegros>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tesoreria/reintegros directive');
  }));
});
