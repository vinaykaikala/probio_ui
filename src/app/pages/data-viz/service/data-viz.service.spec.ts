import { TestBed } from '@angular/core/testing';

import { DataVizService } from './data-viz.service';

describe('DataVizService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataVizService = TestBed.get(DataVizService);
    expect(service).toBeTruthy();
  });
});
