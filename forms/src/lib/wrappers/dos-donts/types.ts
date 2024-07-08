import { DosDontsListProps } from "../../components/dos-donts-list/dos-donts-list.component";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DosDontsOptions extends DosDontsListProps {
    /**
     * Where to place dos / donts list, default is above
     *
     * @type {("above" | "below")}
     * @memberof DosDontsOptions
     */
    position?: "above" | "below";
}

export interface TemplateOptionsDosDonts {

    /**
     * Display dos / donts list for elements
     * that have lists of accepted and unaccepted
     * items
     *
     * @type {DosDontsOptions}
     * @memberof TemplateOptionsDosDonts
     */
    dosDonts?: DosDontsOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldDosDonts {

}