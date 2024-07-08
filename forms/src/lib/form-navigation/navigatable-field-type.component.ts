import { FieldType } from "@ngx-formly/core";
import { flattenFields } from "../utils/formly.utils";
import { map, filter, tap, shareReplay } from "rxjs/operators";
import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { FormNavigationService } from "./form-navigation.service";
import { FieldConfig } from "../models/Types";

export interface FieldMatch {
    /**
     * The direct child field that contains the field of interest
     *
     * @type {FieldConfig}
     * @memberof FieldMatch
     */
    childWithField: FieldConfig;

    /**
     * The index of the direct child that matches
     *
     * @type {number}
     * @memberof FieldMatch
     */
    childIndex: number;

    /**
     * The actual form field that matches the location
     *
     * @type {FieldConfig}
     * @memberof FieldMatch
     */
    field: FieldConfig;
}

@Component({
    template: "",
})
export class NavigatableFieldTypeComponent<T extends FieldConfig> extends FieldType<T> implements OnDestroy {

    private _onDestroy$ = new Subject<void>();

    /**
     * Observable that fires when component is destroyed
     *
     * @readonly
     * @protected
     * @memberof NavigatableFieldTypeComponent
     */
    protected get onDestroy$() {
        return this._onDestroy$.asObservable();
    }

    private _visibleChildren$: Observable<FieldConfig[]>;
    /**
     * An Observable of the current visible children
     *
     * @readonly
     * @protected
     * @memberof NavigatableFieldTypeComponent
     */
    protected get visibleChildren$(): Observable<FieldConfig[]> {
        return this._visibleChildren$;
    }

    private _currentChild$: Observable<FieldConfig>;
    /**
     * An Observable of the current selected child (based on routing)
     *
     * @readonly
     * @protected
     * @memberof NavigatableFieldTypeComponent
     */
    protected get currentChild$() {
        return this._currentChild$;
    }

    private _currentChildIndex$: Observable<number>;

    /**
     * Index of the current selected child
     *
     * @readonly
     * @protected
     * @memberof NavigatableFieldTypeComponent
     */
    protected get currentChildIndex$() {
        return this._currentChildIndex$;
    }

    private _locationFieldMatch$: Observable<FieldMatch>;
    /**
     * An Observable of {FieldMatch} that fires whenever the current 
     * route matches a field/child within this component
     *
     * @readonly
     * @protected
     * @memberof NavigatableFieldTypeComponent
     */
    protected get fieldMatch$() {
        return this._locationFieldMatch$;
    }

    constructor(protected navigationService: FormNavigationService, protected changeDetector: ChangeDetectorRef) {
        super();

        // Visible Children Observable converts visible form routes
        // to a collection of children that are visible within this component
        this._visibleChildren$ = this.navigationService.formRoutes$.pipe(
            map(routes => {
                const visibleFormRoutes = routes.map(({ formRoute }) => formRoute);
                const fields = this.field?.fieldGroup ?? [];
                const visibleFields = fields.filter(field => visibleFormRoutes.includes(field?.formRoute));
                return visibleFields;
            }),
            shareReplay(1)
        );

        // Represents when this component contains a field that matches the current route
        // (Regardless of whether the element is visible)
        const fieldMatch$ = this.navigationService.currentFormRoute$.pipe(
            map((route) => {
                const childFields = this.field?.fieldGroup ?? [];
                const fieldMatches = childFields.flatMap((child, childIndex) => {
                    const nestedChildren = flattenFields(child);
                    return nestedChildren.filter(nestedChild => (
                        nestedChild?.formRoute === route || nestedChild?.fieldRoute === route
                    )).map((nestedChild) => ({
                        field: nestedChild,
                        childWithField: child,
                        childIndex
                    } as FieldMatch));
                }) ?? [];
                const [fieldMatch] = fieldMatches;
                return fieldMatch
            }),
            filter((match) => !!match)
        );

        // Combines field matches with visible children to return visible matches
        this._locationFieldMatch$ = combineLatest([fieldMatch$, this._visibleChildren$]).pipe(
            map(([fieldMatch, visibleFields]) => {
                return {
                    fieldMatch,
                    isVisible: visibleFields.includes(fieldMatch.childWithField),
                    visibleIndex: visibleFields.indexOf(fieldMatch.childWithField)
                }
            }),
            tap(({ isVisible }) => {
                // If the match isn't visible, just navigate to the route of this
                // NavigatableField.  This happens when a form is reloaded / reset and the current
                // page / view becomes hidden due to form data changing
                if (!isVisible) {
                    this.navigationService.navigate(this.field.formRoute);
                }
            }),
            filter(({ isVisible }) => isVisible),
            // We only care about the child's index amonst the other visible fields
            map(({ fieldMatch, visibleIndex }) => ({
                ...fieldMatch,
                childIndex: visibleIndex
            }))
        )

        // The current child that is navigated to
        this._currentChild$ = this._locationFieldMatch$.pipe(
            map(({ childWithField }) => childWithField),
        );

        // The index of the current child
        this._currentChildIndex$ = this._locationFieldMatch$.pipe(
            map(({ childIndex }) => childIndex),
            filter((childIndex) => childIndex >= 0),
        );
    }

    ngOnDestroy(): void {
        this._onDestroy$.next();
    }
}