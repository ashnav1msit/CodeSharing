import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormNavigationService } from '../../form-navigation/form-navigation.service';
import { FormStorageService } from '../../form-storage';
import { FormConfig } from '../../models/Types';

@Component({
  selector: 'abgov-forms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormNavigationService],
})
export class FormComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input()
  config: FormConfig = [];

  @Input()
  storageKey?: string;

  @Input()
  model = {};

  @Input()
  debug = false;

  formOptions: FormlyFormOptions = {
    formState: {
      root: this.model,
    },
  };

  get modelString() {
    return JSON.stringify(this.model ?? {}, undefined, 2);
  }

  private saveSubscription?: Subscription;

  form = new FormGroup({});

  constructor(
    private navigationService: FormNavigationService,
    @Optional() private storage: FormStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.storage) {
      if (this.storageKey) {
        try {
          const savedModel = await this.storage.get(this.storageKey);
          if (savedModel) {
            this.model = {
              ...savedModel,
            };
          }
        } catch (err) {
          console.warn('Issue loading form from storage', err);
        }
      }
      this.saveSubscription = this.form.valueChanges
        .pipe(
          debounceTime(200),
          switchMap(async (data) => {
            try {
              if (this.storageKey) {
                await this.storage.save(this.storageKey, data);
              } else {
                console.warn(
                  "Can't save form, No 'storageKey' defined for form"
                );
              }
            } catch (err) {
              console.log('Error saving form data', err);
            }
          })
        )
        .subscribe();
    }
  }

  ngAfterViewInit(): void {
    // Need to wait until here to register the form
    // as Formly needs a chance to run extensions and initialize
    // The following will place the update on the next tick
    // see: https://angular.io/errors/NG0100
    // todo: we might be able to have the formly extension
    // todo: handle registering routes instead of the form
    Promise.resolve().then(() => {
      this.navigationService.registerForm(this);
    });
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
      delete this.saveSubscription;
    }
  }

  onSubmit() {
    console.log('SUBMIT', this.form, this.model);
    if (this.form.valid) {
      console.log('WILL SUBMIT', this.model);
    } else {
      console.warn('FORM ERRORS', this.form);
    }
  }
}
