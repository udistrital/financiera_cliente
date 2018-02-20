'use strict';

describe('Directive: reportes/reportesSpago', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<reportes/reportes-spago></reportes/reportes-spago>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the reportes/reportesSpago directive');
  }));
});
