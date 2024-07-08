export interface HelpTextOptions {
    title: string;
    contents: string;
    collapsed?: boolean;
    position?: "above" | "below";
}

export interface TemplateOptionsHelpText {
    helpText?: HelpTextOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldHelpText {

}