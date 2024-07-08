import { DosDontsWrapperComponent, fieldDosDontsExtension } from './dos-donts';
import { HelpTextWrapperComponent, fieldHelpTextExtension } from './help-text';
import { FormFieldWrapperComponent } from './form-field';

export const wrapperConfig = [
  {
    name: HelpTextWrapperComponent.WrapperName,
    component: HelpTextWrapperComponent,
  },
  {
    name: DosDontsWrapperComponent.WrapperName,
    component: DosDontsWrapperComponent,
  },
  {
    name: FormFieldWrapperComponent.WrapperName,
    component: FormFieldWrapperComponent
  }
]

export const wrapperExtensions = [
  { name: 'help-text', extension: fieldHelpTextExtension },
  { name: 'dos-donts', extension: fieldDosDontsExtension },
];

export const wrapperComponents = [
  HelpTextWrapperComponent,
  DosDontsWrapperComponent,
  FormFieldWrapperComponent
];
