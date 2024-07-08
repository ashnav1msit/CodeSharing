import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AngularComponentsModule,
  ExperimentalComponentsModule,
} from '@abgov/angular-components';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxMdModule } from 'ngx-md';
import { fieldRoutePathExtension } from './form-navigation';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Components
import { CardComponent } from './components/card/card.component';
import { FormComponent } from './components/form/form.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { HelpTextComponent } from './components/help-text/help-text.component';

// Fields
import { DatePickerComponent } from './fields/date-picker/date-picker.component';
import { StepperComponent } from './fields/stepper/stepper.component';
import { PagesComponent } from './fields/pages/pages.component';
import { SummaryComponent } from './fields/summary/summary.component';
import { NavigationControlsComponent } from './fields/navigation-controls/navigation-controls.component';
import { RepeatComponent } from './fields/repeat/repeat.component';
import { SubmitComponent } from './fields/submit/submit.component';
import { NumericInputComponent } from './fields/numeric-input/numeric-input.component';
import { FileComponent } from './fields/file/file.component';
import { FileValueAccessorDirective } from './fields/file/file-value-accessor';
import { DosDontsListComponent } from './components/dos-donts-list/dos-donts-list.component';

import {
  wrapperComponents,
  wrapperConfig,
  wrapperExtensions,
} from './wrappers';
import { ContentComponent } from './fields/content/content.component';
import { CalloutComponent } from './fields/callout/callout.component';
import { ButtonComponent } from './fields/button/button.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { commonValidatorMessages, commonValidators } from './validators';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    AngularComponentsModule,
    ExperimentalComponentsModule,
    RouterModule,
    NgxMdModule.forRoot(),
    NgbModule,
    MatStepperModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      wrappers: [...wrapperConfig],
      extensions: [
        { name: 'field-route', extension: fieldRoutePathExtension },
        ...wrapperExtensions,
      ],
      types: [
        {
          name: DatePickerComponent.type,
          component: DatePickerComponent,
          wrappers: ['form-field'],
        },
        {
          name: StepperComponent.type,
          component: StepperComponent,
          wrappers: [],
        },
        {
          name: PagesComponent.type,
          component: PagesComponent,
          wrappers: [],
        },
        {
          name: SummaryComponent.type,
          component: SummaryComponent,
          wrappers: [],
        },
        {
          name: NavigationControlsComponent.type,
          component: NavigationControlsComponent,
          wrappers: [],
        },
        {
          name: RepeatComponent.type,
          component: RepeatComponent,
          wrappers: [],
        },
        {
          name: SubmitComponent.type,
          component: SubmitComponent,
          wrappers: [],
        },
        {
          name: 'money',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              addonLeft: {
                text: '$',
              },
              max: 999999.99,
              maxLength: 9,
              pattern: /^\d*(\.\d{1,2})?$/,
            },
            validation: {
              messages: {
                pattern:
                  'Invalid input for money. (Should be in the form 123, 123.4, 123.45)',
                max: 'This amount is too high. Please enter a lower amount.',
              },
            },
          },
        },
        {
          name: NumericInputComponent.type,
          component: NumericInputComponent,
          wrappers: ['form-field'],
        },
        {
          name: FileComponent.type,
          component: FileComponent,
          wrappers: ['form-field'],
        },
        {
          name: ContentComponent.type,
          component: ContentComponent,
          wrappers: [],
        },
        {
          name: CalloutComponent.type,
          component: CalloutComponent,
          wrappers: [],
        },
        {
          name: ButtonComponent.type,
          component: ButtonComponent,
          wrappers: [],
        },
        // ! The following are offered through GOA components but need to be wrapped
        // todo: styled 'checkbox'
        // todo: styled 'select'
        // todo: styled 'radio'
      ],
      validators: [...commonValidators],
      validationMessages: [...commonValidatorMessages],
    }),
    FormlyBootstrapModule,
  ],
  declarations: [
    ...wrapperComponents,
    FormComponent,
    DatePickerComponent,
    StepperComponent,
    PagesComponent,
    SummaryComponent,
    CardComponent,
    NavigationControlsComponent,
    RepeatComponent,
    FormBuilderComponent,
    HelpTextComponent,
    SubmitComponent,
    NumericInputComponent,
    FileComponent,
    FileValueAccessorDirective,
    DosDontsListComponent,
    ContentComponent,
    CalloutComponent,
    ButtonComponent,
    FormFieldComponent,
  ],
  exports: [
    FormComponent,
    FormlyModule,
    FormlyBootstrapModule,
    ReactiveFormsModule,
    FormBuilderComponent,
    HelpTextComponent,
  ],
  providers: [MatDatepickerModule],
})
export class AbGovFormsModule {
  /**
   * Creates the routes needed to support the dynamic forms
   *
   * @static
   * @param {string} rootPath
   * @param {*} component
   * @return {*}  {Route}
   * @memberof DynamicFormsModule
   */
  static createFormRoute(
    rootPath: string,
    component: Route['component']
  ): Route {
    return {
      path: rootPath,
      children: [{ path: '**', component }],
    };
  }
}
