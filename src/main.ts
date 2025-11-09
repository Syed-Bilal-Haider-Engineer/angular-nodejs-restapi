import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { GlobalInterceptErrorHandler } from './app/errorHandler/global-error.interceptor';


bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), {
        provide: HTTP_INTERCEPTORS,
        multi:true,
        useClass: GlobalInterceptErrorHandler
    }]
}).catch((err) => console.error(err));
