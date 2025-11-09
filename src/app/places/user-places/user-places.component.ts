import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  isFetch = signal(false);
  errorMessage = signal<string | undefined>('');

 ngOnInit(): void {
  this.isFetch.set(true);
  const subscription = this.httpClient
    .get<{ places: (Place | null)[] }>('http://localhost:3000/user-places')
    .pipe(
      map((resData) => {
        // Remove null values
        return resData.places.filter((place): place is Place => place !== null);
      }),
      catchError((error) => {
        this.errorMessage.set(
          'Failed to fetch places. Please try again later.'
        );
        console.error('HTTP Error:', error);
        this.isFetch.set(false);
        return of([] as Place[]);
      })
    )
    .subscribe({
      next: (places) => {
        console.log("userPlaces-->", places);
        this.places.set(places);
      },
      complete: () => {
        this.isFetch.set(false);
      },
    });

  this.destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });
}

}
