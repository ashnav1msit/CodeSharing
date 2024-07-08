import { FormlyExtension } from '@ngx-formly/core';
import { FieldConfig } from '../models/Types';
import '../utils/array.utils';
import { RouteableField } from './types';

// ! a bit of a hack here so that we know which types can be navigated into
// todo: add field attribute as part of the navigatable field type
const ROUTABLE_TYPES: FieldConfig['type'][] = ['stepper', 'pages'];

/**
 * Returns whether or not a field can be routed to.
 * i.e. Is a RoutableField type or is a direct child of a RoutableFieldType
 *
 * @param {FieldConfig} field
 * @return {*}
 */
function isRoutable(field: FieldConfig) {
  return (
    ROUTABLE_TYPES.includes(field.type) ||
    ROUTABLE_TYPES.includes(field?.parent?.type)
  );
}

function getFieldPath(field: FieldConfig) {
  const { key, templateOptions: { route } = {}, parent } = field;
  if (!route) {
    if (typeof key === 'string') {
      // Support compound keys (i.e. parent.child )
      return key.replace('.', '-');
    } else if (Array.isArray(key)) {
      return key.join('-');
    } else if (typeof key === 'number') {
      return key.toString();
    } else {
      // If the parent is routable then return index path
      if (ROUTABLE_TYPES.includes(field.parent?.type)) {
        return parent?.fieldGroup?.indexOf(field)?.toString();
      }
      return undefined;
    }
  }
  return route;
}

/**
 * Generates a route for a given field
 *
 * @export
 * @param {FormlyFieldConfig} field
 * @return {*}
 */
function getFormFieldRoutes(field: FieldConfig): RouteableField {
  if (field?.formRoute || field?.fieldRoute) {
    return {
      formRoute: field?.formRoute,
      fieldRoute: field?.fieldRoute,
    };
  }

  const { parent } = field;

  const fieldPath = getFieldPath(field);
  const fieldIndex = parent?.fieldGroup?.indexOf(field) ?? 0;

  let fieldRoute = undefined;

  fieldRoute = [parent?.formRoute, fieldPath]
    .filterNils()
    .filter((p) => p !== '')
    .join('/');

  let formRoute = undefined;
  // By default a field has the same formRoute as it's parent
  const formRouteParts = [parent?.formRoute];
  // If the parent is routable and it's not the first child
  // then push the field path into the formRouteParts
  if (isRoutable(field) && fieldIndex > 0) {
    formRouteParts.push(fieldPath);
  }

  // If the field is routable or there is already a route part defined
  if (isRoutable(field) || parent?.formRoute !== '') {
    formRoute = formRouteParts
      .filterNils()
      .filter((p) => p !== '')
      .join('/');
  }

  return {
    formRoute,
    fieldRoute,
  };
}

export const fieldRoutePathExtension: FormlyExtension = {
  prePopulate(field: FieldConfig): void {
    const { fieldRoute, formRoute } = getFormFieldRoutes(field);
    field.formRoute = formRoute;
    field.fieldRoute = fieldRoute;
  },
};
