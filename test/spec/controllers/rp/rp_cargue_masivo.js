'use strict';

describe('Controller: RpRpCargueMasivoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RpRpCargueMasivoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RpRpCargueMasivoCtrl = $controller('RpRpCargueMasivoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RpRpCargueMasivoCtrl.awesomeThings.length).toBe(3);
  });
});
