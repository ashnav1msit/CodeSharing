import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface FileOptions {
  extensions?: string[];
  uploadTitle?: string;
  labelHelpText?: string;
  extensionMessage? : string;
}

export interface FileConfig extends CustomFieldConfig<FileOptions> {
  type: 'file';
}

@Component({
  selector: 'abgov-forms-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent extends FieldType<FileConfig> {
  static get type() {
    return 'file';
  }

  get formControl(): FormControl {
    return super.formControl as FormControl;
  }

  get extensionMessage() {
    return this.to?.extensionMessage ??
      this.to?.extensions ?
      `Upload must be either ${this.to?.extensions?.join(' or ')}`: undefined;
  }
}
