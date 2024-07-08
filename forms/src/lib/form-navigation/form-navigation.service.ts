import { FormConfig } from '../models/Types';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith, tap, } from 'rxjs/operators';
import { FormComponent } from '../components/form/form.component';
import "../utils/array.utils";
import { RouteableField } from './types';

@Injectable({
  providedIn: 'any',
})
export class FormNavigationService {
  private form?: FormComponent;
  private formRoutesSubscription?: Subscription;
  private nextFormRouteSubject: Subject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private previousFormRouteSubject: Subject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private formRoutesSubject: Subject<RouteableField[]> = new ReplaySubject<RouteableField[]>(1);

  /**
   * Observable of the current form route
   *
   * @type {Observable<string>}
   * @memberof FormNavigationService
   */
  public currentFormRoute$: Observable<string>;

  /**
   * The current route (within the form)
   *
   * @type {string}
   * @memberof FormNavigationService
   */
  public currentRouteUrl?: string;

  /**
   * The previous form route
   *
   * @readonly
   * @type {(Observable<string | undefined>)}
   * @memberof FormNavigationService
   */
  public get previousFormRoute$(): Observable<string | undefined> {
    return this.previousFormRouteSubject.asObservable();
  };

  /**
   * The next form route 
   *
   * @readonly
   * @type {(Observable<string | undefined>)}
   * @memberof FormNavigationService
   */
  public get nextFormRoute$(): Observable<string | undefined> {
    return this.nextFormRouteSubject.asObservable();
  };


  /**
   * Stream of changes to form routes
   *
   * @readonly
   * @type {Observable<string[]>}
   * @memberof FormNavigationService
   */
  public get formRoutes$(): Observable<RouteableField[]> {
    return this.formRoutesSubject.asObservable();
  }

  /**
   * The forms parent Route, useful when using [routerLink]
   *
   * @readonly
   * @memberof FormNavigationService
   */
  get parentRoute() {
    return this.route.parent
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentFormRoute$ = route.url.pipe(
      map(segments => segments.join("/")),
      // ! This is a bit of a hack, but was running into a bit of a race condition
      // ! Might need to figure out a better way of doing this
      tap(url => this.currentRouteUrl = url)
    );
  }

  /**
   * Navigates to a route within the form
   *
   * @param {string} route
   * @param {NavigationExtras} [extras]
   * @memberof FormNavigationService
   */
  navigate(route: string = "", extras?: NavigationExtras) {
    // todo: handle failures here

    if (route === "") {
      route = "./"
    }
    this.router.navigate([route], { relativeTo: this.parentRoute, ...extras });
  }

  /**
   * Registers the form to be used for navigation
   *
   * @param {FormComponent} form
   * @memberof FormNavigationService
   */
  registerForm(form: FormComponent) {
    if (this.formRoutesSubscription) {
      this.formRoutesSubscription.unsubscribe();
      this.formRoutesSubscription = undefined;
    }

    this.form = form;

    if (this.form && this.form.formOptions.fieldChanges) {
      this.formRoutesSubscription = new Subscription();

      // The form is dynamic in nature so the routes
      // must be calculated as the form changes
      this.formRoutesSubscription.add(
        this.form.formOptions.fieldChanges.pipe(
          map(() => this.getFormRoutes()),
        ).pipe(
          startWith(this.getFormRoutes()),
          distinctUntilChanged((a, b) => a.every((val, index) => b[index] === val))
        ).subscribe(this.formRoutesSubject)
      );

      const nextPreviousFormRoutes$ = combineLatest([
        this.currentFormRoute$,
        this.formRoutes$
      ]).pipe(
        map(([route, formRoutes]) => {
          const foundRoute = formRoutes.find(({ fieldRoute }) => fieldRoute === route)
            ?? formRoutes.find(({ formRoute }) => formRoute === route);

          const uniqueRoutes = [...new Set(formRoutes.map(({ formRoute }) => formRoute).filterNils())]
          const currentIndex = uniqueRoutes.findIndex(formRoute => foundRoute?.formRoute === formRoute);

          return {
            next: uniqueRoutes[currentIndex + 1],
            previous: uniqueRoutes[currentIndex - 1]
          }
        }),
        shareReplay(1)
      );

      this.formRoutesSubscription.add(
        nextPreviousFormRoutes$.pipe(
          map(({ next }) => next),
        ).subscribe(this.nextFormRouteSubject)
      );

      this.formRoutesSubscription.add(
        nextPreviousFormRoutes$.pipe(
          // Need to do this since all links are relative to form root and "" breaks things
          map(({ previous }) => previous === "" ? "./" : previous),
        ).subscribe(this.previousFormRouteSubject)
      );
    }
  }

  private get formConfig() {
    return this.form?.config as FormConfig || [];
  }

  private getFormRoutes() {
    // Get Visibile routes
    const routes = this.formConfig?.flattenNested((config) => config.fieldGroup, (config) => {
      // Check expressions ensures that the expressions are evaluated before we use the result
      // got this idea from formly unit tests, see:
      // https://github.com/ngx-formly/ngx-formly/blob/60bece9b9dd4e1719bb6cdf3e49d804453438fb3/src/core/src/lib/extensions/field-expression/field-expression.spec.ts#L120
      if (config.options?.checkExpressions) {
        config.options?.checkExpressions(config);
      }
      return config.hide !== true;
    })
      .map<RouteableField>(field => ({ key: field.key, formRoute: field?.formRoute, fieldRoute: field?.fieldRoute }))
      .filter(({ formRoute }) => formRoute !== undefined && formRoute !== null);
    return routes as RouteableField[];
  }
}



