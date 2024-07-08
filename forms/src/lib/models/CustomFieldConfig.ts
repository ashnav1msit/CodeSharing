import { FormlyFieldConfig } from "@ngx-formly/core";
import { RoutableFieldOptions, RouteableField } from "../form-navigation/types";
import { FieldConfig } from "./Types";
import { WrapperTemplateOptions } from "../wrappers/types";

export type DefaultFieldTemplateOptions = { [key: string]: unknown };

export type FieldTemplateOptions<T = DefaultFieldTemplateOptions> = FormlyFieldConfig["templateOptions"]
    & RoutableFieldOptions
    & WrapperTemplateOptions
    & T

export interface CustomFieldConfig<T = DefaultFieldTemplateOptions> extends FormlyFieldConfig, RouteableField {
    templateOptions?: FieldTemplateOptions<T>;
    fieldGroup?: FieldConfig[];
    fieldArray?: FieldConfig;
    parent?: FieldConfig;
}
