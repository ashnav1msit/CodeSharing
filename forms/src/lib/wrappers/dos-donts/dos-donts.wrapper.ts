import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FieldConfig } from '../../models/Types';

@Component({
    selector: 'abgov-forms-dos-donts-wrapper',
    styleUrls: ['./dos-donts.wrapper.scss'],
    template: `
    <ng-container *ngIf="wrapperOptions?.position!=='below'" [ngTemplateOutlet]="dosdontsTemplate"></ng-container>
    <ng-container #fieldComponent></ng-container>
    <ng-container *ngIf="wrapperOptions?.position==='below'" [ngTemplateOutlet]="dosdontsTemplate"></ng-container>
        
    <ng-template #dosdontsTemplate>
        <div *ngIf="wrapperOptions" [ngClass]="wrapperOptions?.position ?? 'above'" class='dos-donts-container'>
            <abgov-forms-dos-donts-list         
                [doList]="wrapperOptions?.doList ?? []"
                [dontList]="wrapperOptions?.dontList ?? []"
                [doTitle]="wrapperOptions?.doTitle ?? 'Accepted'"
                [dontTitle]="wrapperOptions?.dontTitle ?? 'Not Accepted'"
                >
            </abgov-forms-dos-donts-list>
        </div>
    </ng-template>
  `
})
export class DosDontsWrapperComponent extends FieldWrapper<FieldConfig> {
    public static WrapperName = "dos-donts";

    get wrapperOptions() {
        return this.to?.dosDonts
    }
}
