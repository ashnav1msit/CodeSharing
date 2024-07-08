import { DatePickerConfig } from '../fields/date-picker/date-picker.component';
import { StepperConfig } from '../fields/stepper/stepper.component';
import { PagesConfig } from '../fields/pages/pages.component';
import { SummaryConfig } from '../fields/summary/summary.component';
import { NavigationControlsConfig } from '../fields/navigation-controls/navigation-controls.component';
import { RepeatConfig } from '../fields/repeat/repeat.component';
import { SubmitConfig } from '../fields/submit/submit.component';

import { RouteableField } from '../form-navigation/types';
import { FieldTemplateOptions } from './CustomFieldConfig';
import { CheckboxConfig } from './fields/CheckboxConfig';
import { FormGroupConfig } from './fields/FormGroup';
import { InputConfig, MoneyInputConfig } from './fields/InputConfig';
import { RadioConfig } from './fields/RadioConfig';
import { SelectConfig } from './fields/SelectConfig';
import { TextAreaConfig } from './fields/TextAreaConfig';
import { NumericInputConfig } from '../fields/numeric-input/numeric-input.component';
import { FileConfig } from '../fields/file/file.component';
import { ContentConfig } from '../fields/content/content.component';
import { CalloutConfig } from '../fields/callout/callout.component';
import { ButtonConfig } from '../fields/button/button.component';

type ConcreteFieldConfigs =
  | DatePickerConfig
  | PagesConfig
  | RepeatConfig
  | SummaryConfig
  | StepperConfig
  | NavigationControlsConfig
  | InputConfig
  | MoneyInputConfig
  | TextAreaConfig
  | CheckboxConfig
  | RadioConfig
  | SelectConfig
  | FormGroupConfig
  | SubmitConfig
  | NumericInputConfig
  | FileConfig
  | ContentConfig
  | CalloutConfig
  | ButtonConfig;

export type FieldConfig = ConcreteFieldConfigs & {
  templateOptions?: FieldTemplateOptions;
  fieldGroup?: ConcreteFieldConfigs[];
  fieldArray?: FieldConfig;
  parent?: FieldConfig;
} & RouteableField;

export type FormConfig = FieldConfig[];

export * from './Option';
