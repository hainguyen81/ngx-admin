import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
// import { takeWhile } from 'rxjs/operators';
// import { forkJoin } from 'rxjs';
// import { UserData } from '../../../@core/data/users';
let ContactsComponent = class ContactsComponent {
    // private alive = true;
    // contacts: any[];
    // recent: any[];
    constructor() {
        /*forkJoin(
          this.userService.getContacts(),
          this.userService.getRecentUsers(),
        )
          .pipe(takeWhile(() => this.alive))
          .subscribe(([contacts, recent]: [Contacts[], RecentUsers[]]) => {
            this.contacts = contacts;
            this.recent = recent;
          });*/
    }
    ngOnDestroy() {
        // this.alive = false;
    }
};
ContactsComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-contacts',
        styleUrls: ['./contacts.component.scss'],
        templateUrl: './contacts.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ContactsComponent);
export { ContactsComponent };
//# sourceMappingURL=contacts.component.js.map