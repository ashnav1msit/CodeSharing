import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { CustomFieldConfig } from '../../models/CustomFieldConfig';

export interface RepeatOptions {
  controls?: {
    add?: {
      show?: boolean;
      text?: string;
    };
    remove?: {
      show?: boolean;
      text?: string;
    };
  };
  itemTitle?: {
    prefix?: string;
    includeNumber?: boolean;
  };
  length?: number;
}

export interface RepeatConfig extends CustomFieldConfig<RepeatOptions> {
  type: 'repeat';
}

@Component({
  selector: 'abgov-forms-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss'],
})
export class RepeatComponent
  extends FieldArrayType<RepeatConfig>
  implements OnInit, OnDestroy
{
  private _onDestroy: Subject<void> = new Subject();
  static get type() {
    return 'repeat';
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
  }

  ngOnInit(): void {
    this.field.options?.fieldChanges
      ?.pipe(
        filter((change: FormlyValueChangeEvent) => {
          return (
            change.type === 'expressionChanges' &&
            change.field === this.field &&
            change.property === 'templateOptions.length' &&
            Number.isFinite(change.value)
          );
        }),
        map((change) => change.value as number),
        startWith(this.to?.length ?? 0),
        takeUntil(this._onDestroy)
      )
      .subscribe({
        next: (desiredLength) => {
          console.log('DESIRED LENGTH', desiredLength);
          const numArrayFields = this.field.fieldGroup?.length ?? 0;
          const delta = desiredLength - numArrayFields;
          // ! Ideally we'd be able to add and remove several fields at once,
          // ! for improved performance, but the hooks aren't present in the field
          // ! array, may add a PR to make it more possible, but for now just happens
          // ! when many are added and removed at once (since we have add/remove them one by one)
          for (let i = 0; i < Math.abs(delta); i++) {
            if (delta > 0) {
              this.add();
            } else if (delta < 0) {
              this.remove(numArrayFields - i - 1);
            }
          }
          this.field.options?.detectChanges?.(this.field);
        },
      });
  }

  getItemTitle(index: number): string {
    return !this.to?.itemTitle
      ? ''
      : `${this.to.itemTitle?.prefix ?? ''}${
          this.to.itemTitle?.includeNumber !== false ? index : ''
        }`;
  }
}
