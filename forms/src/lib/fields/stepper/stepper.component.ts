import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NavigatableFieldTypeComponent } from '../../form-navigation';
import { isFormlyFieldValid } from '../../utils/formly.utils';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';
import '../../utils/array.utils';
import { FieldConfig } from '../../models/Types';
import { takeUntil } from 'rxjs/operators';

interface StepperOptions {
  className?: string;
  orientation?: MatStepper['orientation'];
}

export interface StepperConfig extends CustomFieldConfig<StepperOptions> {
  type: 'stepper';
}

@Component({
  selector: 'abgov-forms-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent
  extends NavigatableFieldTypeComponent<StepperConfig>
  implements AfterViewInit
{
  static get type() {
    return 'stepper';
  }

  selectedIndex = 0;

  @ViewChild(MatStepper)
  stepper!: MatStepper;

  private _visibleChildren: FieldConfig[];

  // The steps are filtered using the visible children
  public get steps(): FieldConfig[] {
    const stepFields = this.field?.fieldGroup ?? [];
    return stepFields.filter(
      (step) =>
        this._visibleChildren !== undefined &&
        this._visibleChildren.includes(step)
    );
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
    // Unfortunately the stepper can't handle reactive / async inputs, so we need to set properties
    // so that we can interact with the stepper imperitively

    // Visible children binding
    this.visibleChildren$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (children) => {
        // set the visible children and trigger change detection
        this._visibleChildren = children;
        this.changeDetector.detectChanges();
      },
    });

    // Selected Index Binding
    this.currentChildIndex$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (index) => {
        this.selectedIndex = index;
        this.changeDetector.detectChanges();
      },
    });
  }

  onStepChange(evt: StepperSelectionEvent) {
    // if this change was introduced via rx then these will the equal
    if (evt.selectedIndex !== this.selectedIndex) {
      const newStep = this.steps[evt.selectedIndex];
      if (newStep) {
        this.navigationService.navigate(newStep.formRoute);
      }
    }
  }

  isValid(field: FieldConfig): boolean {
    return isFormlyFieldValid(field);
  }
}
