'use strict';

describe('Directive: procesoVariosEst', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<proceso-varios-est></proceso-varios-est>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the procesoVariosEst directive');
  }));
});
