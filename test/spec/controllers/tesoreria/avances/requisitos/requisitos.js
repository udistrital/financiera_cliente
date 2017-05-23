'use strict';

describe('Controller: TesoreriaAvancesRequisitosRequisitosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesRequisitosRequisitosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesRequisitosRequisitosCtrl = $controller('TesoreriaAvancesRequisitosRequisitosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesRequisitosRequisitosCtrl.awesomeThings.length).toBe(3);
  });
});
