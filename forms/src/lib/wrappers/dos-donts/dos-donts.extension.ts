import { FormlyExtension } from "@ngx-formly/core";
import { FieldConfig } from "../../models/Types";
import { DosDontsWrapperComponent } from "./dos-donts.wrapper";

export const fieldDosDontsExtension: FormlyExtension = {
    postPopulate(field: FieldConfig): void {
        // if field doesn't have template options or the wrapper is already present
        if (!field.templateOptions ||
            ((field.wrappers?.indexOf(DosDontsWrapperComponent.WrapperName) ?? -1) !== -1)) {
            return;
        }

        if (field.templateOptions?.dosDonts) {
            // Add Wrapper before other wrappers so that validation shows up correctly under field
            field.wrappers = [DosDontsWrapperComponent.WrapperName, ...(field.wrappers ?? [])];
        }
    }
}

