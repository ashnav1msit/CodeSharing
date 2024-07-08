import { FieldConfig } from '../models/Types';
import './array.utils';

// Todo: implement the visitor pattern to clean up many of these

/**
 * Utility recursively determines of form field is valid
 *
 * @export
 * @param {FieldConfig} field
 * @return {*}  {boolean}
 */

export function isFormlyFieldValid(field: FieldConfig): boolean {
  let isValid: boolean | undefined;

  // If the field has a key, then it *should* be a form input

  if (field?.formControl) {
    isValid = field.formControl?.valid;
  } else if (field?.fieldGroup) {
    isValid = field?.fieldGroup?.every((f) => isFormlyFieldValid(f));
  }

  // If something was null return true

  return isValid === undefined ? true : isValid;
}

/**
 * Utility for getting the text value of a given field
 *
 * @export
 * @param {FieldConfig} field
 * @return {*}
 */

export function getFieldValueLabel(field: FieldConfig) {
  const value = field?.formControl?.value;
  if (Array.isArray(field.templateOptions?.options)) {
    // Options are generally in the form
    // { value, label }

    return field.templateOptions?.options.find((item) => item?.value === value)
      ?.label;
  }
  //todo:need to use separate library for dates display
  if (field.type === 'datetime') {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  } else if (field.type === 'repeat') {
    // For repeat types, we don't want to show the value ([OBJECT OBJECT])
    return '';
  }
  return value;
}

/**
 * Attempts to get field title from field
 *
 * @export
 * @param {FieldConfig} [field]
 * @return {*}
 */

export function getFieldTitle(field?: FieldConfig) {
  if (!field) {
    return '';
  }

  let title = field?.templateOptions?.label ?? '';

  if (title.trim() === '') {
    title = field?.templateOptions?.page?.title ?? '';
  }

  if (title.trim() === '') {
    title = getFieldTitle(field?.parent);
  }

  return title;
}

/**
 * Flattens Formly Fields into a single array
 *
 * @export
 * @param {FieldConfig} root
 */
export function flattenFields(
  root: FieldConfig,
  predicate?: (config: FieldConfig) => boolean
): FieldConfig[] {
  if (!root) {
    return [];
  }

  return [root].flattenNested((config) => config?.fieldGroup, predicate);
}

/**
 * Searches through the field graph to locate the first field with the given key
 *
 * @export
 * @param {FieldConfig} root
 * @param {FieldConfig["key"]} key
 * @param {boolean} [searchParent=true]
 * @return {*}  {(FormlyFieldConfig | undefined)}
 */

export function findFieldByKey(
  root: FieldConfig,
  key: FieldConfig['key'],
  searchParent: boolean = true
): FieldConfig | undefined {
  if (!key) {
    return undefined;
  }

  if (root.key === key) {
    return root;
  }

  // Search children first

  if (root.fieldGroup) {
    // Don't re-search the parent of the children

    const matching = root.fieldGroup
      .map((f) => findFieldByKey(f, key, false))
      .filter((field) => !!field);
    if (matching.length === 1) {
      return matching[0];
    } else if (matching.length > 1) {
      console.warn(`Multiple fields matching key '${key}', returning first`);
    }
  }

  // Search Parent

  if (searchParent && root.parent) {
    return findFieldByKey(root.parent, key);
  }

  return undefined;
}

/**
 * Returns whether or not a given field includes a child field (at any level)
 *
 * @export
 * @param {FieldConfig} haystack
 * @param {FieldConfig} needle
 */
export function includesChild(
  haystack: FieldConfig,
  needle: FieldConfig
): boolean {
  // Todo: This isn't optimized as it has to flatten all fields before searching

  return flattenFields(haystack).includes(needle);
}
