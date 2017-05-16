'use strict';

describe('Controller: PlanCuentasGestionPlanCuentasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasGestionPlanCuentasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasGestionPlanCuentasCtrl = $controller('PlanCuentasGestionPlanCuentasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasGestionPlanCuentasCtrl.awesomeThings.length).toBe(3);
  });
});
