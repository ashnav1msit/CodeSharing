import { Component } from '@angular/core';
import { FieldConfig, FormConfig, Option } from '../../models/Types';
import { map, tap } from 'rxjs/operators';
import { concat, of, Subscription } from 'rxjs';

// The following allows us to replace the type=undefined
// which is used to define form groups with "formgroup"
type ReplaceNull<T, TReplace> = T extends null | undefined ? TReplace : T
type FieldTypes = ReplaceNull<FieldConfig["type"], "formgroup">;

// todo: Get this to work
// const INPUT_OPTIONS: Record<FieldTypes, Option> = {
//   "input": { value: "input", label: "Input" },
//   "radio": { value: "radio", label: "Radio" },
//   "textarea": { value: "textarea", label: "Textarea" },
//   "checkbox": { value: "checkbox", label: "Checkbox" },
//   "datetime": { value: "datetime", label: "Datetime" },
//   "navigation": { value: "navigation", label: "Navigation" },
//   "pages": { value: "pages", label: "Pages" },
//   "repeat": { value: "repeat", label: "Repeat" },
//   "select": { value: "select", label: "Select" },
//   "stepper": { value: "stepper", label: "Stepper" },
//   "summary": { value: "summary", label: "Summary" },
//   "helptext": { value: "helptext", label: "Help Text" },
//   "formgroup": { value: undefined as never, label: "Form Group" },
//   "submit": { value: "submit", label: "Submit" },
// }

// const INPUTS_WITH_CHILDREN = [
//   INPUT_OPTIONS.formgroup.value,
//   INPUT_OPTIONS.repeat.value,
//   INPUT_OPTIONS.pages.value,
//   INPUT_OPTIONS.stepper.value,
// ]

// function getFieldGroupConfig(): FieldConfig {
//   let sub: Subscription | undefined;
//   return {
//     type: "repeat",
//     key: "fieldGroup",
//     templateOptions: {
//       label: "Fields"
//     },
//     fieldArray: {
//       fieldGroup: [
//         {
//           type: "select",
//           defaultValue: INPUT_OPTIONS.input.value,
//           key: "type",
//           templateOptions: {
//             label: "Type",
//             options: Object.values(INPUT_OPTIONS)
//           }
//         },
//         {
//           type: "input",
//           templateOptions: {
//             label: "label",
//             required: true
//           }
//         },
//         {
//           type: "input",
//           templateOptions: {
//             label: "key",
//             required: true
//           }
//         }, {
//           hooks: {
//             onInit: (field) => {
//               const typeControl = field?.form?.get('type');
//               if (field && typeControl) {
//                 sub = concat(
//                   of(typeControl.value),
//                   typeControl.valueChanges
//                 ).pipe(
//                   tap((val) => console.log("INPUT CHANGED", val)),
//                   map((value: FieldTypes) => INPUTS_WITH_CHILDREN.includes(value)),
//                   tap((hasFields) => console.log("HAS FIELDS", hasFields))
//                 ).subscribe({
//                   next: (hasFields) => {
//                     if (field.parent) {
//                       if (hasFields) {
//                         field.parent.fieldGroup?.push(getFieldGroupConfig());
//                       } else {
//                         const foundFields = field.parent.fieldGroup?.find(item => item.key === "fieldGroup")
//                         console.log("FOUND FIELDS", foundFields);
//                       }

//                     }
//                   }
//                 })
//               }
//             },
//             onDestroy: (field) => {
//               if (sub) {
//                 console.log("CLEANUP");
//                 sub.unsubscribe();
//                 sub = undefined;
//               }
//             }
//           }
//         }
//       ]
//     }
//   }
// }


@Component({
  selector: 'abgov-forms-form-builder',
  templateUrl: './form-builder.component.html',
})
export class FormBuilderComponent {
  public config: FormConfig = [
    // {
    //   type: "input",
    //   templateOptions: {
    //     label: "Form Name",
    //     required: true
    //   }
    // },
    // getFieldGroupConfig()
  ]

}
