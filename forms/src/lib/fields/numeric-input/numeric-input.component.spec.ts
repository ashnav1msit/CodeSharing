import { FormlyFieldConfig } from '@ngx-formly/core';
import { AbGovFormsModule } from '../../abgov-forms.module';
import { createFieldComponent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [AbGovFormsModule],
  });
};

// todo: Should write more extensive tests
describe('NumericInputComponent', () => {
  it('should create', () => {
    const component = renderComponent({ type: 'numericinput' });
    expect(component).toBeTruthy();
  });
});
