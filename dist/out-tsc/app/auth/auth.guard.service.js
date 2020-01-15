import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
let AuthGuard = class AuthGuard {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate() {
        return this.authService.isAuthenticated()
            .pipe(tap(authenticated => {
            if (!authenticated) {
                this.router.navigate(['auth/login']);
            }
        }));
    }
};
AuthGuard = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [NbAuthService, Router])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.service.js.map