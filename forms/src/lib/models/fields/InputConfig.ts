import { CustomFieldConfig } from "../CustomFieldConfig";

interface InputAddon {
    text?: string;
    class?: string;
}

interface InputOptions {
    addonRight?: InputAddon;
    addonLeft?: InputAddon;
}

export interface InputConfig extends CustomFieldConfig<InputOptions> {
    type: "input";
}


/**
 * Money Input Extension
 *
 * @export
 * @interface MoneyInputConfig
 * @extends {CustomFieldConfig<InputOptions>}
 */
export interface MoneyInputConfig extends CustomFieldConfig<InputOptions> {
    type: "money";
}
