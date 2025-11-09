import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { Place } from './place.model';
import { ErrorService } from '../../shared/shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly httpClient = inject(HttpClient);
  private errorService = inject(ErrorService)
  private userPlaces = signal<Place[]>([]);
  places = signal<Place[] | undefined>(undefined);
  loadedUserPlaces = this.userPlaces.asReadonly();

  setUserPlaces(places: Place[]) {
    this.userPlaces.set(places);
  }

  loadAvailablePlaces(url:string) {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((resData) =>  resData.places),
        catchError((error) => {
          this.errorService.showError("Failed to fetch places. Please try again later.")
          return throwError(() => new Error("Failed to fetch places. Please try again later."))
        })
      );
  }

  loadUserPlaces(url:string) {

    return this.httpClient
      .get<{ places: (Place | null)[] }>(url)
      .pipe(
        map((resData) => {
          const validPlaces = resData.places.filter(
            (place): place is Place => place !== null
          );
          return validPlaces;
        }),
        catchError((error) => {
          this.errorService.showError("Failed to fetch places. Please try again later.")
           return throwError(() => new Error("Failed to fetch places. Please try again later."))
        })
      );
  }

  addPlaceToUserPlaces(url: string, selectedPlace: Place) {
    if (!selectedPlace?.id) {
      return of({} as { userPlaces: Place[] });
    }

    const previousUserPlaces = this.userPlaces();
    const alreadyExists = previousUserPlaces.some(p => p.id === selectedPlace.id);

    if (!alreadyExists) {
      this.userPlaces.set([...previousUserPlaces, selectedPlace]);
    }

    return this.httpClient.put<{ userPlaces: Place[] }>(url, { placeId: selectedPlace.id }).pipe(
      catchError((error) => {
        this.errorService.showError("Failed to update places. Please try again later.");
        this.userPlaces.set(previousUserPlaces); 
        return throwError(() => new Error("Failed to update places. Please try again later."));
      })
    );
  }
}
