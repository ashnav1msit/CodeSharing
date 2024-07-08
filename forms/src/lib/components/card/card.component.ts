import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'abgov-forms-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  public noPadding?: boolean = false;

  @Input()
  public title?: string;

  @Input()
  headerTemplate?: TemplateRef<any>

  @Input()
  contentTemplate?: TemplateRef<any>
}
