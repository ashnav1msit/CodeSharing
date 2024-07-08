import type { TemplateOptionsDosDonts } from "./dos-donts";
import { TemplateOptionsFormFieldWrapper } from "./form-field";
import type { TemplateOptionsHelpText } from "./help-text";

export type WrapperTemplateOptions = TemplateOptionsDosDonts
  & TemplateOptionsHelpText
  & TemplateOptionsFormFieldWrapper;
