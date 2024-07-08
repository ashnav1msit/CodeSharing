import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormNavigationService } from '../../form-navigation';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface NavigationControlOptions {
  disableNext?: boolean;
}

export interface NavigationControlsConfig extends CustomFieldConfig<NavigationControlOptions> {
  type: "navigation"
}

@Component({
  selector: 'abgov-forms-navigation-controls',
  templateUrl: './navigation-controls.component.html',
  styleUrls: ['./navigation-controls.component.scss']
})
export class NavigationControlsComponent extends FieldType<NavigationControlsConfig> {

  static get type() {
    return "navigation"
  }

  constructor(public navigation: FormNavigationService) {
    super();
  }

}
