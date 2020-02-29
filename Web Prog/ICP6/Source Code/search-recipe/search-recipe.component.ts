import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  @ViewChild('recipe') recipes: ElementRef;
  @ViewChild('place') places: ElementRef;
  recipeValue: any;
  placeValue: any;
  venueList = [];
  recipeList = [];

  currentLat: any;
  currentLong: any;
  geolocationPosition: any;

  constructor(private _http: HttpClient) {
  }

  ngOnInit() {

    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.geolocationPosition = position;
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
      });
  }

  getVenues() {

    this.recipeValue = this.recipes.nativeElement.value;
    this.placeValue = this.places.nativeElement.value;
    if (this.recipeValue !== null) {
      this._http.get('https://api.edamam.com/search?q=' + this.recipeValue +
        '&app_id=d3f161b3&app_key=6bc278b924a5f346881dfa8eefbf3659').subscribe((res: any) => {
        console.log(res.hits);
        this.recipeList = Object.keys(res.hits).map(function (k) {
          const i = res.hits[k].recipe;
          return {name: i.label, icon: i.image, url: i.url}
        });
      });


    }

    if (this.placeValue != null && this.placeValue !== '') {
      this._http.get('https://api.foursquare.com/v2/venues/search?client_id=YFMKQYRTN2KHDPHHEWRDQLRFPDXUM31EN1HSCAYWTYYNJZWU' +
        '&client_secret=FWFROLKEYZPMTX2B15N0EOZN21VVJ5UJTCFX5O3XSRURHSS5&v=20190926&near=' + this.placeValue + '&query=restaurant').
      subscribe(respRestuarant => {
        this.venueList = respRestuarant['response']['venues'];
      }, error => {});
    }
  }
}
