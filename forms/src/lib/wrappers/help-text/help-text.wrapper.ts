import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FieldConfig } from '../../models/Types';

@Component({
    selector: 'abgov-forms-help-text-wrapper',
    styleUrls: ['./help-text.wrapper.scss'],
    template: `
    <ng-container *ngIf="wrapperOptions?.position==='above'" [ngTemplateOutlet]="helptextTemplate"></ng-container>
    <ng-container #fieldComponent></ng-container>
    <ng-container *ngIf="wrapperOptions?.position!=='above'" [ngTemplateOutlet]="helptextTemplate"></ng-container>
    
    <ng-template #helptextTemplate>
        <div *ngIf="wrapperOptions" [ngClass]="wrapperOptions?.position??'below'" class='help-text-container'>
            <abgov-forms-help-text         
                *ngIf="wrapperOptions?.title && wrapperOptions?.contents"
                [title]="wrapperOptions!.title"
                [contents]="wrapperOptions!.contents">
            </abgov-forms-help-text>
        </div>
    <ng-template>
  `
})
export class HelpTextWrapperComponent extends FieldWrapper<FieldConfig> {
    public static WrapperName = "help-text";

    get wrapperOptions() {
        return this?.to?.helpText;
    }
}
