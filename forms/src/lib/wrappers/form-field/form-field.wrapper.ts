import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FieldConfig } from '../../models/Types';

@Component({
  selector: 'abgov-forms-form-field-wrapper',
  styleUrls: ['./form-field.wrapper.scss'],
  template: `
    <abgov-forms-form-field
      [showError]="showError"
      [labelForId]="id"
      [label]="to.label"
      [required]="to.required"
      [requiredMarkerText]="to.requiredMarkerText"
      [hideRequiredMarker]="to.hideRequiredMarker"
      [hintText]="to.description"
      [hideLabel]="to.hideLabel"
    >
      <ng-template #fieldComponent></ng-template>
      <formly-validation-message
        errors
        [field]="field"
      ></formly-validation-message>
    </abgov-forms-form-field>
  `,
})
export class FormFieldWrapperComponent extends FieldWrapper<FieldConfig> {
  public static WrapperName = 'form-field';

  get requiredMarker() {
    return this?.to?.requiredMarkerText ?? '*';
  }

  get wrapperOptions() {
    return this?.to?.helpText;
  }
}
