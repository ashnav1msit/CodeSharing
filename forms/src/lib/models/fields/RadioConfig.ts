import { CustomFieldConfig } from "../CustomFieldConfig";
import type { Option } from "../Option";

export interface RadioOptions {
    options: Omit<Option, "disabled">[]
}

export interface RadioConfig extends CustomFieldConfig<RadioOptions> {
    type: "radio";
}
