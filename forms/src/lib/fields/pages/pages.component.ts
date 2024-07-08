import { FieldConfig } from '../../models/Types';
import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigatableFieldTypeComponent } from '../../form-navigation';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface PagesOptions {
  allowInvalid?: boolean;
  className?: string;
  showProgress?: boolean;
}

type PageChildConfig = FieldConfig & {
  templateOptions: {
    /**
     * Options for this Page
     *
     * 
     */
    page?: {

      /**
       * The title of this page
       *
       * @type {string}
       */
      title?: string;
    }
  }
}

export interface PagesConfig extends CustomFieldConfig<PagesOptions> {
  type: "pages";
  fieldGroup: PageChildConfig[];
}

@Component({
  selector: 'abgov-forms-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent extends NavigatableFieldTypeComponent<PagesConfig> {
  static get type() {
    return "pages";
  };

  public get currentPage$() {
    return this.currentChild$ as Observable<PageChildConfig>;
  };

  public get pages$() {
    return this.visibleChildren$ as Observable<PageChildConfig[]>;
  }

  private _progress$: Observable<number> = combineLatest([this.visibleChildren$, this.currentChildIndex$]).pipe(
    map(([fields, currentIndex]) => {
      const progress = (Math.max(0, currentIndex) / (fields.length - 1)) * 100
      return progress;
    })
  );

  public get progress$() {
    return this._progress$;
  }
}