'use strict';

describe('Service: grid/gridapiService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var grid/gridapiService;
  beforeEach(inject(function (_grid/gridapiService_) {
    grid/gridapiService = _grid/gridapiService_;
  }));

  it('should do something', function () {
    expect(!!grid/gridapiService).toBe(true);
  });

});
