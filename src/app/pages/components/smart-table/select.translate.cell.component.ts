import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Host,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-select-translate-cell',
    template: `
        <div [ngSwitch]="isEditable">
            <div *ngSwitchCase="false" [innerHTML]="(cellValue || '') | translate"></div>
            <div *ngSwitchDefault>
                <select [ngClass]='inputClass'
                        class='form-control'
                        [(ngModel)]='cell.newValue'
                        [name]='cellId'
                        [disabled]='!isEditable'
                        (click)='onClick.emit($event)'
                        (keydown.enter)='onEdited.emit($event)'
                        (keydown.esc)='onStopEditing.emit()'>
                    <option *ngFor='let option of cellColumnConfig?.list' [value]='option.value'
                            [selected]='option.value === cellValue'>
                        {{(option.title || option.label || '') | translate}}
                    </option>
                </select>
            </div>
        </div>
    `,
})
export class SelectTranslateCellComponent extends AbstractCellEditor {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectTranslateCellComponent} class
     * @param _parentView {CustomViewComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentView, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }
}
