'use strict';

describe('Controller: PlanCuentasGestionDescuentosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasGestionDescuentosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasGestionDescuentosCtrl = $controller('PlanCuentasGestionDescuentosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanCuentasGestionDescuentosCtrl.awesomeThings.length).toBe(3);
  });
});
