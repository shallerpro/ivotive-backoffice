import { Injectable } from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ScreensizeService {



  private isDesktop = new BehaviorSubject(false );

  constructor() { }


  onResize ( size : number ) {

    console.log ( size );

    if ( size < 568 ) {
      this.isDesktop.next(false );
    } else
      this.isDesktop.next( true  );
  }


  isDesktopView () : Observable<boolean> {
    return this.isDesktop.asObservable().pipe( distinctUntilChanged() );
  }
}
