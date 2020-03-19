import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseTabsetComponent} from '../../../tab/base.tab.component';
import {WarehouseItemTabsetDatasource} from '../../../../../services/implementation/warehouse-item/warehouse-item.tabset.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {throwError} from 'rxjs';

@Component({
    selector: 'ngx-tab-warehouse-item',
    template: '<p>Back</p>',
    styleUrls: ['../../../tab/tab.component.scss'],
})
export class WarehouseItemTabsetComponent {
    constructor() {
    }
}
