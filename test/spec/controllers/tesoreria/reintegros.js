'use strict';

describe('Controller: TesoreriaReintegrosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaReintegrosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaReintegrosCtrl = $controller('TesoreriaReintegrosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaReintegrosCtrl.awesomeThings.length).toBe(3);
  });
});
