import { FormlyFieldConfig } from "@ngx-formly/core";
import { AbGovFormsModule } from "../../abgov-forms.module";
import { createFieldComponent } from "@ngx-formly/core/testing";
import { DatePickerComponent } from "./date-picker.component";

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [AbGovFormsModule],
  });
};


// todo: Should write more extensive tests
describe('DatePickerComponent', () => {
  it('should create', () => {
    const component = renderComponent({ type: DatePickerComponent.type });

    expect(component).toBeTruthy();
  });
});
