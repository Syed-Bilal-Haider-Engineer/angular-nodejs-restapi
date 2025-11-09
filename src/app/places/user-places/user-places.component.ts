import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrls: ['./user-places.component.css'],
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly placesService = inject(PlacesService);

  places = this.placesService.loadedUserPlaces; 
  isFetch = this.placesService.isFetch;
  errorMessage = this.placesService.errorMessage;

  ngOnInit(): void {
    const subscription = this.placesService.loadUserPlaces("http://localhost:3000/user-places").subscribe({
      next: (places) => this.placesService.places.set(places),
      error: (err) => console.error('Subscription Error:', err),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
