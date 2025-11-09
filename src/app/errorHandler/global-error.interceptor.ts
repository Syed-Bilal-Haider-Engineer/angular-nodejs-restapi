import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
@Injectable()
export class GlobalInterceptErrorHandler implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe (catchError((error:HttpErrorResponse) =>
        {
        let message = '';

        switch (error.status) {
          case 0:
            message = 'Network error. Please check your internet connection.';
            break;
          case 400:
            message = 'Bad Request. Please check your input.';
            break;
          case 401:
            message = 'Unauthorized. Please log in again.';
            break;
          case 404:
            message = 'Requested resource not found.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = `Unexpected Error: ${error.message}`;
        }
        return throwError(() => new Error(message))
    }))   
  }
}