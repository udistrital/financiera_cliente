'use strict';

describe('Controller: PlanCuentasEditarCuentaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasEditarCuentaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasEditarCuentaCtrl = $controller('PlanCuentasEditarCuentaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasEditarCuentaCtrl.awesomeThings.length).toBe(3);
  });
});
