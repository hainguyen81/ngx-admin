import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
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
import {Row} from 'ng2-smart-table/lib/lib/data-set/row';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {GeneralSettingsSmartTableComponent} from './general.settings.table.component';
import {GeneralSettingsToolbarComponent} from './general.settings.toolbar.component';
import {GeneralSettingsFormlyComponent} from './general.settings.formly.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {throwError} from 'rxjs';
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_DELETE_DATABASE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.SYSTEM_SETTINGS,
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
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT, ACTION_DELETE_DATABASE];
    }

    protected get visibleActionsOnBack(): String[] {
        return [ACTION_BACK, ACTION_DELETE, ACTION_RESET, ACTION_SAVE];
    }

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            GeneralSettingsToolbarComponent,
            GeneralSettingsSmartTableComponent,
            GeneralSettingsFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        const newInst: IGeneralSettings = new GeneralSettings(null, null, null, null);
        newInst.builtin = false;
        super.backComponent.setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        (row && row.getData()) || throwError('Invalid data to edit');
        const setting: IGeneralSettings = row.getData() as IGeneralSettings;
        setting || throwError('Invalid data to edit');
        if (setting.builtin) setting.value = this.translate(setting.value.toString());
        super.backComponent.setModel(setting);
    }
}
