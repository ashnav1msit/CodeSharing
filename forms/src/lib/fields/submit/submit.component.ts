import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface SubmitOptions {
  buttonText?: string;
}

export interface SubmitConfig extends CustomFieldConfig<SubmitOptions> {
  type: 'submit';
}

@Component({
  selector: 'abgov-forms-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],
})
export class SubmitComponent extends FieldType<SubmitConfig> {
  static get type() {
    return 'submit';
  }
}
