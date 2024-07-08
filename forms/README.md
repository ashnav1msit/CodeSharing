# abgov-forms

This library is a customized wrapper around [Formly](https://main.formly.dev/) for use within the ae-digital platform.

Currently this library is being built with the notion that it could be pulled into it's own isolated library, so it's dependencies should be kept to a minimum but also only to externally installable packages. In order to align with the DIO Design system, we are leveraging the [DIO Components Library](https://github.com/GovAlta/ui-components) (angular-components).

## Running unit tests

Run `nx test abgov-forms` to execute the unit tests.

## Creating new form field type

In the root repo run `yarn make:form-field` which will scaffold a new form field within the forms library.
