import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly httpClient = inject(HttpClient);

  private userPlaces = signal<Place[]>([]);
  places = signal<Place[] | undefined>(undefined);
  errorMessage = signal<string | undefined>(undefined);
  isFetch = signal(false);

  loadedUserPlaces = this.userPlaces.asReadonly();

  // ✅ 1. Load Available Places
  loadAvailablePlaces(url:string) {
    this.isFetch.set(true);

    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => {
          this.isFetch.set(false);
          this.errorMessage.set(undefined);
          this.places.set(resData.places);
          return resData.places;
        }),
        catchError((error) => {
          console.error('Available Places Error:', error);
          this.errorMessage.set(
            'Failed to fetch places. Please try again later.'
          );
          this.isFetch.set(false);
          return of([] as Place[]);
        })
      );
  }

  // ✅ 2. Load User Places
  loadUserPlaces(url:string) {
    this.isFetch.set(true);

    return this.httpClient
      .get<{ places: (Place | null)[] }>(url)
      .pipe(
        map((resData) => {
          this.isFetch.set(false);
          const validPlaces = resData.places.filter(
            (place): place is Place => place !== null
          );
          this.userPlaces.set(validPlaces);
          return validPlaces;
        }),
        catchError((error) => {
          console.error('User Places Error:', error);
          this.errorMessage.set(
            'Failed to fetch user places. Please try again later.'
          );
          this.isFetch.set(false);
          return of([] as Place[]);
        })
      );
  }

  // ✅ 3. Add Place to User Places
  addPlaceToUserPlaces(url: string, selectedPlace: Place) {
    if (!selectedPlace?.id) {
      this.errorMessage.set('Invalid place selected.');
      return of(null);
    }
    let previousUserPlaces = this.userPlaces();
    if (!previousUserPlaces.some((p: Place) => p.id === selectedPlace.id)) {
      this.userPlaces.set([...previousUserPlaces, selectedPlace]);
    } else {
       this.userPlaces.set(previousUserPlaces);
    }

    this.isFetch.set(true);
    return this.httpClient.put(url, { placeId: selectedPlace.id }).pipe(
      map((response) => {
        this.isFetch.set(false);
        this.errorMessage.set(undefined);
        console.log('Place added successfully:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Add Place Error:', error);
        this.errorMessage.set('Failed to add place. Please try again later.');
        this.isFetch.set(false);
        this.userPlaces.set(previousUserPlaces);
        return of(null);
      })
    );
  }
}
