import { TestBed } from '@angular/core/testing';
import { LocalFormStorageService } from '.';
import { FormStorageService } from './form-storage.service';

describe('LocalFormStorageService', () => {
  let service: FormStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FormStorageService,
          useClass: LocalFormStorageService
        }
      ]
    });
    service = TestBed.inject(FormStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service instanceof LocalFormStorageService).toEqual(true);
  });
});
