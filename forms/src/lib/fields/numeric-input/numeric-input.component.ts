import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface NumericInputOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface NumericInputConfig
  extends CustomFieldConfig<NumericInputOptions> {
  type: 'numericinput';
}

@Component({
  selector: 'abgov-forms-numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
})
export class NumericInputComponent extends FieldType<NumericInputConfig> {
  static get type() {
    return 'numericinput';
  }

  get formControl(): FormControl {
    return super.formControl as FormControl;
  }
}
