import { FormlyFieldConfig } from "@ngx-formly/core";

export function addFieldChildren(parentField: FormlyFieldConfig, ...children: FormlyFieldConfig[]) {
    const { fieldGroup = [] } = parentField;
    children.forEach(child => {
        // Needed since parent is readonly on FormlyFieldConfig
        (child as any).parent = parentField;
        fieldGroup.push(child);
    });
    parentField.fieldGroup = fieldGroup;
}