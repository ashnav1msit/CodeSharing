import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface ContentOptions {
  content: string;
}

export interface ContentConfig extends CustomFieldConfig<ContentOptions> {
  type: 'content';
}

@Component({
  selector: 'abgov-forms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent extends FieldType<ContentConfig> {
  static get type() {
    return 'content';
  }
}
