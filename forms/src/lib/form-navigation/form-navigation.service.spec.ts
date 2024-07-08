import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormNavigationService } from './form-navigation.service';

describe('FormNavigationService', () => {
  let service: FormNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
    });
    service = TestBed.inject(FormNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
