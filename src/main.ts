import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { GlobalInterceptErrorHandler } from './app/errorHandler/global-error.interceptor';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    return next(request);
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(withInterceptors([loggingInterceptor])), {
        provide: HTTP_INTERCEPTORS,
        multi:true,
        useClass: GlobalInterceptErrorHandler
    }]
}).catch((err) => console.error(err));
