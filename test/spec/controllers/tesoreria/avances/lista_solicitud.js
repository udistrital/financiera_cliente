'use strict';

describe('Controller: TesoreriaAvancesListaSolicitudCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesListaSolicitudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesListaSolicitudCtrl = $controller('TesoreriaAvancesListaSolicitudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesListaSolicitudCtrl.awesomeThings.length).toBe(3);
  });
});
