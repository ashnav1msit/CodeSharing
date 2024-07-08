import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import {
  findFieldByKey,
  flattenFields,
  getFieldTitle,
  getFieldValueLabel,
  isFormlyFieldValid,
} from '../../utils/formly.utils';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';
import '../../utils/array.utils';

/**
 * Options for the SummaryTemplate
 *
 * @export
 * @interface SummaryOptions
 */
export interface SummaryOptions {
  invalidAsWarnings?: boolean;
  showHeading?: boolean;
  showCardTitle?: boolean;
  sectionKeys?: string[];
  showCallout?: boolean;
  calloutContents?: string;
  callout?: {
    title?: string;
    contents?: string;
    show?: boolean;
  };
}

export interface SummaryConfig extends CustomFieldConfig<SummaryOptions> {
  type: 'summary';
}

export interface SummaryItem {
  label: string;
  value: string;
  route: string;
  valid: boolean;
}

interface SectionSummary {
  section: FormlyFieldConfig;
  items: SummaryItem[];
}

// todo: Probably should put this somewhere else?
// todo: better yet, add a property to the field summarizable=false
const NON_SUMMARIZABLE_FIELD_TYPES = [
  'summary',
  'pages',
  'stepper',
  'heading',
  'formly-group',
];

@Component({
  selector: 'abgov-forms-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent
  extends FieldType<SummaryConfig>
  implements OnInit
{
  static get type() {
    return 'summary';
  }
  items: SectionSummary[] = [];

  get invalidFields() {
    return this.items
      .flatMap(({ items }) => items)
      .filter(({ valid }) => valid !== true);
  }

  get summaryOptions(): SummaryOptions {
    return this.field?.templateOptions || ({} as SummaryOptions);
  }

  constructor(public route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.items = this.generateSummaryItems();
  }

  private generateSummaryItems() {
    if (this.field.parent) {
      const parent = this.field.parent;

      const { sectionKeys = [parent?.key] } = this.summaryOptions;

      const sectionSummaries = sectionKeys
        .map((key) => findFieldByKey(parent, key))
        .filterNils()

        .map((section) => {
          const sectionFields = flattenFields(
            section,
            (field) => field.hide !== true
          );

          const sectionItems = sectionFields
            // Filter out items that aren't summarizable
            .filter((field) => {
              let valid =
                !!field.type &&
                !NON_SUMMARIZABLE_FIELD_TYPES.includes(field.type) &&
                field.key &&
                getFieldTitle(field);

              if (field.type === 'repeat') {
                // Don't want to show repeat field types if there are no
                // entries
                return field.formControl?.value.length > 0 ? valid : false;
              }

              return valid;
            })
            .map((field) => {
              const value = getFieldValueLabel(field);
              const label = getFieldTitle(field);
              return {
                route:
                  field?.formRoute?.length == 0
                    ? field?.fieldRoute
                    : field?.formRoute,
                label,
                value,
                valid: isFormlyFieldValid(field),
              } as SummaryItem;
            });
          return {
            section,
            items: sectionItems,
          } as SectionSummary;
        });

      return sectionSummaries;
    } else {
      return [];
    }
  }
}
