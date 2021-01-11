import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NbAuthService} from '@nebular/auth';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly authService: NbAuthService;

    protected getAuthService(): NbAuthService {
        return this.authService;
    }

    private readonly router: Router;

    protected getRouter(): Router {
        return this.router;
    }

    constructor(authService: NbAuthService, router: Router) {
        this.authService = authService;
        this.router = router;
    }

    canActivate() {
        return this.getAuthService().isAuthenticated()
            .pipe(
                tap(authenticated => {
                    if (!authenticated) {
                        this.getRouter().navigate(['auth/login']);
                    }
                }),
            );
    }
}
