import { CustomFieldConfig } from "../CustomFieldConfig";
import type { Option } from "../Option";

export interface SelectOptions {
    multiple?: boolean;
    selectAllOption?: string;
    options: Option[];
}

export interface SelectConfig extends CustomFieldConfig<SelectOptions> {
    type: "select";
}
