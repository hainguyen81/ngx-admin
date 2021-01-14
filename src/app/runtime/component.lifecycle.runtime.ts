import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges,} from '@angular/core';

/**
 * Define component life-cycle interfaces
 */
export class ComponentLifeCycleRuntime
    implements OnChanges, OnInit, DoCheck,
    AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked,
    OnDestroy {

    get prototypeName(): string {
        return Reflect.getPrototypeOf(this).constructor.name;
    }

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngOnChanges', this.prototypeName]);
    }

    ngOnInit(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngOnInit', this.prototypeName]);
    }

    ngDoCheck(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngDoCheck', this.prototypeName]);
    }

    ngAfterContentInit(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngAfterContentInit', this.prototypeName]);
    }

    ngAfterContentChecked(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngAfterContentChecked', this.prototypeName]);
    }

    ngAfterViewInit(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngAfterViewInit', this.prototypeName]);
    }

    ngAfterViewChecked(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngAfterViewChecked', this.prototypeName]);
    }

    ngOnDestroy(): void {
        // TODO Waiting for implementing from children component
        window.console.warn(['ComponentLifeCycle', 'ngOnDestroy', this.prototypeName]);
    }
}
