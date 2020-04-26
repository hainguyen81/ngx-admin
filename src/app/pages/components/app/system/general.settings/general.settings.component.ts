import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject, OnInit,
    Renderer2, ViewContainerRef,
} from '@angular/core';
import {AppTableFlipFormComponent} from '../../components/app.table.flip.form.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {GeneralSettingsSmartTableComponent} from './general.settings.table.component';
import {GeneralSettingsToolbarComponent} from './general.settings.toolbar.component';
import {GeneralSettingsFormlyComponent} from './general.settings.formly.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {throwError} from 'rxjs';
import {isNullOrUndefined} from 'util';
import {IToolbarActionsConfig} from '../../../toolbar/abstract.toolbar.component';
import {ACTION_DELETE_DATABASE, ACTION_IMPORT} from '../../components/app.toolbar.component';

@Component({
    moduleId: MODULE_CODES.SYSTEM_SETTINGS,
    selector: 'ngx-flip-card-app-system-general-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
    ],
})
export class GeneralSettingsComponent
    extends AppTableFlipFormComponent<
        IGeneralSettings, GeneralSettingsDatasource,
        GeneralSettingsToolbarComponent,
        GeneralSettingsSmartTableComponent,
        GeneralSettingsFormlyComponent>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {GeneralSettingsComponent} class
     * @param dataSource {GeneralSettingsDatasource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     */
    constructor(@Inject(GeneralSettingsDatasource) dataSource: GeneralSettingsDatasource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            GeneralSettingsToolbarComponent,
            GeneralSettingsSmartTableComponent,
            GeneralSettingsFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        this.onFlipped.subscribe(value => this._applyActionsOnFlipped());
    }

    protected onNewData($event: IEvent): void {
        const newInst: IGeneralSettings = new GeneralSettings(null, null, null, null);
        newInst.builtin = false;
        super.getBackComponent().setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        (row && row.getData()) || throwError('Invalid data to edit');
        const setting: IGeneralSettings = row.getData() as IGeneralSettings;
        setting || throwError('Invalid data to edit');
        if (setting.builtin) setting.value = this.translate(setting.value.toString());
        super.getBackComponent().setModel(setting);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private _applyActionsOnFlipped() {
        if (isNullOrUndefined(this.getToolbarComponent())) return;

        const actions: IToolbarActionsConfig[] = this.getToolbarComponent().getActions();
        (actions || []).forEach(action => {
            switch (action.id) {
                case ACTION_DELETE_DATABASE:
                case ACTION_IMPORT: {
                    action.visible = !super.isFlipped();
                    break;
                }
                default: {
                    action.visible = super.isFlipped();
                    break;
                }
            }
        });
    }
}
