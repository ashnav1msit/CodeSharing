import { Component, Input } from '@angular/core';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';
import { CardComponent } from '../card/card.component';

export interface HelpTextOptions {

  /**
   * Markdown contents
   *
   * @type {string}
   * @memberof HelpTextOptions
   */
  contents: string;
  title: string;
  expanded?: boolean;
}

export interface HelpTextConfig extends CustomFieldConfig<HelpTextOptions> {
  type: 'helptext';
}

@Component({
  selector: 'abgov-forms-help-text',
  templateUrl: './help-text.component.html',
  styleUrls: ['./help-text.component.scss'],
})
export class HelpTextComponent extends CardComponent {
  @Input()
  contents: string;

  @Input()
  expanded?: boolean = false
}
