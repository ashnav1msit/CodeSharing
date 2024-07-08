import { FormlyFieldConfig } from '@ngx-formly/core';
import { DynamicFormsModule } from '../../abgov-forms.module';
import { createFieldComponent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [DynamicFormsModule],
  });
};

// todo: Should write more extensive tests
describe('ContentComponent', () => {
  it('should create', () => {
    const component = renderComponent({ type: 'content' });
    expect(component).toBeTruthy();
  });
});
