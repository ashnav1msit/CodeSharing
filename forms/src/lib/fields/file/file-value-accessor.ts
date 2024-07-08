import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => { }

@Directive({
    // tslint:disable-next-line
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[type=file]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FileValueAccessorDirective),
        multi: true
    }],
})
// https://github.com/angular/angular/issues/7341
export class FileValueAccessorDirective implements ControlValueAccessor {

    @HostListener('change', ['$event.target.files'])
    onChange: (files: FileList | null) => void = NOOP;

    @HostListener('blur')
    onTouched: () => void = NOOP;

    constructor(private element: ElementRef<HTMLInputElement>) {

    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeValue(obj: never): void {
        // does nothing;
    }

    registerOnChange(handler: FileValueAccessorDirective['onChange']): void {
        this.onChange = handler;
    }

    registerOnTouched(handler: FileValueAccessorDirective['onTouched']): void {
        this.onTouched = handler;
    }

    setDisabledState(disabled: boolean) {
        if (this.element?.nativeElement) {
            this.element.nativeElement.disabled = disabled;
        }
    }
}