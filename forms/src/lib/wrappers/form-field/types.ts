export interface HelpTextOptions {
    title: string;
    contents: string;
    collapsed?: boolean;
    position?: "above" | "below";
}

export interface TemplateOptionsFormFieldWrapper {
    hideLabel?: boolean;
    requiredMarkerText?: string;
    hideRequiredMarker?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldHelpText {

}