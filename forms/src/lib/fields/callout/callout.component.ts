import { GoACalloutComponent } from '@abgov/angular-components';
import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface CalloutOptions {
  title?: string;
  content: string;
  type?: GoACalloutComponent['type'];
}

export interface CalloutConfig extends CustomFieldConfig<CalloutOptions> {
  type: 'callout';
}

@Component({
  selector: 'abgov-forms-callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
})
export class CalloutComponent extends FieldType<CalloutConfig> {
  static get type() {
    return 'callout';
  }
}
