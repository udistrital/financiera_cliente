'use strict';

describe('Service: modelsService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var modelsService;
  beforeEach(inject(function (_modelsService_) {
    modelsService = _modelsService_;
  }));

  it('should do something', function () {
    expect(!!modelsService).toBe(true);
  });

});
