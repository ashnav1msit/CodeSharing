import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface DatePickerOptions {
  allowFuture?: boolean;
}

export interface DatePickerConfig extends CustomFieldConfig<DatePickerOptions> {
  type: 'datetime';
}

@Component({
  selector: 'abgov-forms-date-picker',
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent extends FieldType<DatePickerConfig> {
  public get maxDate() {
    return this.to?.allowFuture === false ? new Date() : undefined;
  }

  static get type() {
    return 'datetime';
  }

  get formControl(): FormControl {
    return super.formControl as FormControl;
  }
}
