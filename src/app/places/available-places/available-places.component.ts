import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrls: ['./available-places.component.css'],
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  isFetch = signal(false)
  errorMessage = signal<string | undefined>('')
  ngOnInit(): void {
    this.isFetch.set(true);
    const subscription = this.httpClient.get<{places:Place[]}>("http://localhost:3000/places").pipe(
      map((resData) =>{
        return resData.places
      }),
      catchError((error) =>{
        this.errorMessage.set('Failed to fetch places. Please try again later.');
          console.error('HTTP Error:', error);
          this.isFetch.set(false);
          return of([] as Place[])
      })
    ).subscribe({

      next: (places) => {
        this.places.set(places);
      },
      // error: err => {
      //     this.errorMessage.set('Failed to fetch places. Please try again later.');
      //     console.error('HTTP Error:', err);
      //     this.isFetch.set(false);
      //   },
      complete:()=>{
        this.isFetch.set(false)
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

    onSelectUserPlaces(selectedPlace: Place) {
      console.log("selectedPlace==>",selectedPlace)
    if(selectedPlace?.id) {
      const subscription = this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: selectedPlace?.id,
      })
      .subscribe({
        next: (response) => {
          //  this.places.set(response.places);
          console.log('places', response);
        },
        error: (err) => {
          this.errorMessage.set(
            'Failed to fetch places. Please try again later.'
          );
          console.error('HTTP Error:', err);
          this.isFetch.set(false);
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
}
