import { Component, Input } from '@angular/core';


/**
 * Form Field wrapper class for providing consistant labels, required, errors
 *
 * @example
 * <abgov-forms-form-field>
 *  <input type="text" ... />
 *  <div errors> <!-- Target the errors content slot -->
 *   display errors in here
 *  </div>  
 * </abgov-forms-form-field>
 * 
 * @export
 * @class FormFieldComponent
 */
@Component({
  selector: 'abgov-forms-form-field',
  template: `
    <div [class.has-error]="showError" [ngClass]="{className}" class="form-field">
      <label *ngIf="label && hideLabel !== true" [attr.for]="labelForId" class="form-label">
        {{ label }}
        <span *ngIf="required && hideRequiredMarker === false">{{requiredMarker}}</span>
      </label>
      <ng-content></ng-content>
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <ng-content select="[errors]"></ng-content>
      </div>
      <small *ngIf="hintText" class="form-text text-muted">{{ hintText }}</small>
    </div>
  `,
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  @Input()
  className?: string;

  /**
   * The id of the element to associate with this label
   *
   * @type {string}
   * @memberof FormFieldComponent
   */
  @Input()
  labelForId?: string;

  /**
   * Label for form Field
   *
   * @type {string}
   * @memberof FormFieldComponent
   */
  @Input()
  label?: string;


  /**
   * Hide label
   *
   * @type {boolean}
   * @memberof FormFieldComponent
   */
  @Input()
  hideLabel?: boolean = false;

  /**
   * Description
   *
   * @type {string}
   * @memberof FormFieldComponent
   */
  @Input()
  hintText?: string;

  @Input()
  required?: boolean = false;

  @Input()
  requiredMarkerText?: string = "*";

  @Input()
  hideRequiredMarker?: boolean = false;

  @Input()
  showError?: boolean = true;

  get requiredMarker() {
    return this.requiredMarkerText ?? "*";
  }
}
