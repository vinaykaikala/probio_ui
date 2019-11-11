import { TestBed } from '@angular/core/testing';

import { DataVizFrankenplotsService } from './data-viz-frankenplots.service';

describe('DataVizFrankenplotsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataVizFrankenplotsService = TestBed.get(DataVizFrankenplotsService);
    expect(service).toBeTruthy();
  });
});
