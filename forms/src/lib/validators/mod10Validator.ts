import { mod10Validator } from '../utils/mod10Validation';
import {
  FieldValidatorFn,
} from '@ngx-formly/core/lib/models';

export const MOD10_VALIDATOR_NAME = 'mod10';
export const MOD10_DEFAULT_ERROR_MESSAGE = 'Invalid input';

export const formlyMod10Validator: FieldValidatorFn = (control) => {
  return mod10Validator(control.value)
    ? null
    : { [MOD10_VALIDATOR_NAME]: true };
};
