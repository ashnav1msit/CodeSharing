import { PagesComponent } from './pages.component';
import { RouterTestingModule } from '@angular/router/testing';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AbGovFormsModule } from '../../abgov-forms.module';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [
      AbGovFormsModule,
      RouterTestingModule
    ],
  });
};

describe.only('PagesComponent', () => {

  it('should create', () => {
    const component = renderComponent({ type: PagesComponent.type });

    expect(component).toBeTruthy();
  });
});
