import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';
import { ThemeModule } from '../../@theme/theme.module';
import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
let EditorsModule = class EditorsModule {
};
EditorsModule = tslib_1.__decorate([
    NgModule({
        imports: [
            NbCardModule,
            ThemeModule,
            EditorsRoutingModule,
            CKEditorModule,
        ],
        declarations: [
            ...routedComponents,
        ],
    })
], EditorsModule);
export { EditorsModule };
//# sourceMappingURL=editors.module.js.map