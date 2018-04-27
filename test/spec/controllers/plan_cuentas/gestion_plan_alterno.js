'use strict';

describe('Controller: PlanCuentasGestionPlanAlternoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasGestionPlanAlternoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasGestionPlanAlternoCtrl = $controller('PlanCuentasGestionPlanAlternoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasGestionPlanAlternoCtrl.awesomeThings.length).toBe(3);
  });
});
