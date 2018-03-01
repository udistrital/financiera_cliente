'use strict';

describe('Controller: PacCierrePeriodoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PacCierrePeriodoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PacCierrePeriodoCtrl = $controller('PacCierrePeriodoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PacCierrePeriodoCtrl.awesomeThings.length).toBe(3);
  });
});
