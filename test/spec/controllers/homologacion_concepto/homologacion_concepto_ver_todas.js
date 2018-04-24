'use strict';

describe('Controller: HomologacionConceptoHomologacionConceptoVerTodasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var HomologacionConceptoHomologacionConceptoVerTodasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomologacionConceptoHomologacionConceptoVerTodasCtrl = $controller('HomologacionConceptoHomologacionConceptoVerTodasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomologacionConceptoHomologacionConceptoVerTodasCtrl.awesomeThings.length).toBe(3);
  });
});
