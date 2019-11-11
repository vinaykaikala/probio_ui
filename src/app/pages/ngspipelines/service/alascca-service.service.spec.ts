import { TestBed } from '@angular/core/testing';

import { AlasccaServiceService } from './alascca-service.service';

describe('AlasccaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlasccaServiceService = TestBed.get(AlasccaServiceService);
    expect(service).toBeTruthy();
  });
});
