'use strict';

describe('Controller: PlanCuentasEditarDescuentoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasEditarDescuentoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasEditarDescuentoCtrl = $controller('PlanCuentasEditarDescuentoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasEditarDescuentoCtrl.awesomeThings.length).toBe(3);
  });
});
