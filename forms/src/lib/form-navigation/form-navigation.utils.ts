import { FormConfig } from "../models/Types";
import "../utils/array.utils";

/**
 * Inspects the current state of the form config and returns
 * the visible routes
 * @export
 * @param {FormConfig} formConfig
 * @return {*} 
 */
export function getVisibleRoutes(formConfig: FormConfig) {
    // Get the unique routes within the form
    const routes = [...new Set(
        formConfig
            .flattenNested((config) => config.fieldGroup, (config) => config.hide !== true)
            .map(field => field?.formRoute)
            .filterNils()
    )];
    return routes;
}