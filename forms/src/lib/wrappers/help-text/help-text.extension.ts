import { FormlyExtension } from "@ngx-formly/core";
import { FieldConfig } from "../../models/Types";
import { HelpTextWrapperComponent } from "./help-text.wrapper";

export const fieldHelpTextExtension: FormlyExtension = {
    postPopulate(field: FieldConfig): void {
        // if field doesn't have template options or the wrapper is already present
        if (!field.templateOptions ||
            ((field.wrappers?.indexOf(HelpTextWrapperComponent.WrapperName) ?? -1) !== -1)) {
            return;
        }

        if (field.templateOptions?.helpText) {
            // Add HelpTextWrapper before other wrappers so that validation shows up correctly under field
            field.wrappers = [HelpTextWrapperComponent.WrapperName, ...(field.wrappers || [])];
        }
    }
}