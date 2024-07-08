import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterTestingModule } from '@angular/router/testing';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { AbGovFormsModule } from '../../abgov-forms.module';
import { FieldConfig } from '../../models/Types';
import { StepperComponent } from './stepper.component';

const renderComponent = (field: FieldConfig) => {
  return createFieldComponent(field, {
    imports: [AbGovFormsModule, RouterTestingModule],
  });
};


// todo: Should write more extensive tests
describe('StepperComponent', () => {
  it('should create', () => {
    const component = renderComponent({ type: "stepper" });
    expect(component).toBeTruthy();
  });
});