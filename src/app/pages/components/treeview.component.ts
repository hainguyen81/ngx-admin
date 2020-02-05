import {AfterViewInit, Component, Inject, Renderer2} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from './abstract.component';

@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class TreeviewComponent extends AbstractComponent implements AfterViewInit {

    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService) {
        super(dataSource, contextMenuService, logger, renderer, translateService);
    }
}
