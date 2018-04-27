'use strict';

describe('Controller: PlanCuentasCrearDescuentoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasCrearDescuentoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasCrearDescuentoCtrl = $controller('PlanCuentasCrearDescuentoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasCrearDescuentoCtrl.awesomeThings.length).toBe(3);
  });
});
