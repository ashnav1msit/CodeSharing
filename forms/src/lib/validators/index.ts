import {
  FormlyFieldConfig,
  ValidationMessageOption,
  ValidatorOption,
} from '@ngx-formly/core/lib/models';
import {
  MOD10_VALIDATOR_NAME,
  formlyMod10Validator,
  MOD10_DEFAULT_ERROR_MESSAGE,
} from './mod10Validator';

/**
 * Attempts to get field title from field
 *
 * @export
 * @param {any} [field]
 * @return {*}
 */
export function minlengthValidationMessage(err: any, field: FormlyFieldConfig) {
  return `Should have at least ${field?.templateOptions?.minLength} characters`;
}

export const commonValidators: ValidatorOption[] = [
  { name: MOD10_VALIDATOR_NAME, validation: formlyMod10Validator },
];

export const commonValidatorMessages: ValidationMessageOption[] = [
  { name: MOD10_VALIDATOR_NAME, message: MOD10_DEFAULT_ERROR_MESSAGE },
  { name: 'required', message: 'This field is required' },
  { name: 'minlength', message: minlengthValidationMessage },
];
