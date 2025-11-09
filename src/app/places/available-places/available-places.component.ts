import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrls: ['./available-places.component.css'],
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly placesService = inject(PlacesService);

  places = this.placesService.places;
  isFetch = this.placesService.isFetch;
  errorMessage = this.placesService.errorMessage;

  ngOnInit(): void {
    const subscription = this.placesService.loadAvailablePlaces("http://localhost:3000/places").subscribe((places) => {
      this.places.set(places);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSelectUserPlaces(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces("http://localhost:3000/user-places",selectedPlace).subscribe({
      next: (response) => {
        console.log('Added to user places:', response);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
