'use strict';

describe('Controller: TesoreriaAvancesLegalizacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesLegalizacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesLegalizacionCtrl = $controller('TesoreriaAvancesLegalizacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesLegalizacionCtrl.awesomeThings.length).toBe(3);
  });
});
