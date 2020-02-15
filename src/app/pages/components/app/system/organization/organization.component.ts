import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseSplitPaneComponent} from '../../../splitpane/base.splitpane.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {OrganizationTreeviewComponentService} from './organization.treeview.component.service';
import {OrganizationFormlyComponentService} from './organization.formly.component.service';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationFormlyComponent} from './organization.formly.component';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import {SplitAreaDirective} from 'angular-split';
import {IOrganization} from '../../../../../@core/data/organization';
import ComponentUtils from '../../../../../utils/component.utils';
import {OrganizationToolbarComponent} from './organization.toolbar.component';
import {OrganizationToolbarComponentService} from './organization.toolbar.component.service';
import {IEvent} from '../../../abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../toolbar/abstract.toolbar.component';
import {DeepCloner} from '../../../../../utils/object.utils';
import {ToastrService} from 'ngx-toastr';
import {ConfirmPopup} from 'ngx-material-popup';
import {throwError} from 'rxjs';
import {ModalDialogService} from 'ngx-modal-dialog';

/* Organization left area configuration */
export const OrganizationTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 20,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Organization right area configuration */
export const OrganizationFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    /*minSize: 50,*/
    maxSize: 70,
    lockSize: false,
    visible: true,
};

/**
 * Organization split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class OrganizationSplitPaneComponent
    extends BaseSplitPaneComponent<OrganizationDataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private organizationToolbarComponent: OrganizationToolbarComponent;
    private organizationTreeviewComponent: OrganizationTreeviewComponent;
    private organizationFormlyComponent: OrganizationFormlyComponent;
    private selectedOrganization: IOrganization | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the selected {IOrganization} instance
     * @return the selected {IOrganization} instance
     */
    protected getSelectedOrganization(): IOrganization {
        return this.selectedOrganization;
    }

    /**
     * Get the {OrganizationTreeviewComponent} instance
     * @return the {OrganizationTreeviewComponent} instance
     */
    protected getTreeviewComponent(): OrganizationTreeviewComponent {
        return this.organizationTreeviewComponent;
    }

    /**
     * Get the {OrganizationFormlyComponent} instance
     * @return the {OrganizationFormlyComponent} instance
     */
    protected getFormlyComponent(): OrganizationFormlyComponent {
        return this.organizationFormlyComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationSplitPaneComponent} class
     * @param dataSource {OrganizationDataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     */
    constructor(@Inject(OrganizationDataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            modalDialogService, confirmPopup);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create left/right component panes
        this.createPaneComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.$data || !(event.$data as IToolbarActionsConfig)) {
            return;
        }
        let action: IToolbarActionsConfig;
        action = event.$data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                this.doSave();
                break;
            case ACTION_RESET:
                this.doReset();
                break;
            case ACTION_DELETE:
                this.doDelete();
                break;
        }
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create organization toolbar component {OrganizationToolbarComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {OrganizationToolbarComponent}
     */
    private createOrganizationToolbarComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): OrganizationToolbarComponent {
        let toolbarComponentService: OrganizationToolbarComponentService;
        toolbarComponentService = new OrganizationToolbarComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(toolbarComponentService, viewContainerRef);
    }

    /**
     * Create organization tree-view component {OrganizationTreeviewComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {OrganizationTreeviewComponent}
     */
    private createOrganizationTreeviewComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): OrganizationTreeviewComponent {
        let treeviewComponentService: OrganizationTreeviewComponentService;
        treeviewComponentService = new OrganizationTreeviewComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(treeviewComponentService, viewContainerRef);
    }

    /**
     * Create organization formly component {OrganizationFormlyComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {OrganizationFormlyComponent}
     */
    private createOrganizationFormlyComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): OrganizationFormlyComponent {
        let formlyComponentService: OrganizationFormlyComponentService;
        formlyComponentService = new OrganizationFormlyComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(formlyComponentService, viewContainerRef, true);
    }

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        const componentFactoryResolver: ComponentFactoryResolver = this.getFactoryResolver();
        const viewContainerRefs: ViewContainerRef[] = this.getSplitAreaHolderViewContainerComponents();
        const headerViewContainer = this.getHeaderViewContainerComponent();
        const splitAreas: SplitAreaDirective[] = this.getSplitAreaComponents();

        // configure areas
        this.configArea(splitAreas[0], OrganizationTreeAreaConfig);
        this.configArea(splitAreas[1], OrganizationFormAreaConfig);

        // create toolbar component
        this.organizationToolbarComponent = this.createOrganizationToolbarComponent(
            componentFactoryResolver, headerViewContainer);
        this.organizationToolbarComponent.actionListener()
            .subscribe((e: IEvent) => this.onClickAction(e));

        // create tree-view component
        this.organizationTreeviewComponent = this.createOrganizationTreeviewComponent(
            componentFactoryResolver, viewContainerRefs[0]);

        // handle click tree-view item to show form
        this.organizationTreeviewComponent.setClickItemListener((e, it) => {
            if (it && it.value) {
                let organization: IOrganization;
                organization = it.value as IOrganization;
                if (organization) {
                    this.selectedOrganization = organization;
                    // create formly form component
                    this.organizationFormlyComponent = this.createOrganizationFormlyComponent(
                        componentFactoryResolver, viewContainerRefs[1]);
                    this.doReset();
                }
            }
        });
    }

    // -------------------------------------------------
    // MAIN FUNCTION
    // -------------------------------------------------

    /**
     * Perform saving data
     */
    private doSave(): void {
        this.getFormlyComponent().getFormGroup().updateValueAndValidity();
        if (this.getFormlyComponent().getFormGroup().invalid) {
            this.showError(this.organizationToolbarComponent.getToolbarHeader().title,
                'common.form.invalid_data');
            return;
        }

        this.getDataSource().update(
            this.getSelectedOrganization(),
            this.getFormlyComponent().getModel())
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    private doReset(): void {
        let clonedOrg: IOrganization;
        clonedOrg = DeepCloner(this.selectedOrganization);
        delete clonedOrg.parent, clonedOrg.children;
        this.organizationFormlyComponent.setModel(clonedOrg);
    }

    /**
     * Perform deleting data
     */
    private doDelete(): void {
        this.getConfirmPopup().show({
            cancelButton: 'common.toast.confirm.delete.cancel',
            color: 'warn',
            content: 'common.toast.confirm.delete.message',
            okButton: 'common.toast.confirm.delete.ok',
            title: this.organizationToolbarComponent.getToolbarHeader().title,
        }).toPromise().then(value => this.getLogger().debug('Confirm Result', value));
        // this.getDataSource().remove(this.getFormlyComponent().getModel())
        //     .then(() => this.showDeleteDataSuccess())
        //     .catch(() => this.showSaveDataError());
    }
}
