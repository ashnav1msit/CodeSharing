import { GoAButtonComponent } from '@abgov/angular-components';
import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface ButtonOptions {
  text: string;
  buttonType?: GoAButtonComponent['buttonType'];
  buttonSize?: GoAButtonComponent['buttonSize'];
  buttonStyle?: 'danger';
}

export interface ButtonConfig extends CustomFieldConfig<ButtonOptions> {
  type: 'button';
}

@Component({
  selector: 'abgov-forms-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent extends FieldType<ButtonConfig> {
  static get type() {
    return 'button';
  }
}
