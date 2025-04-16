/// <reference types="@angular/localize" />

import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";

import {environment} from "./environments/environment";
import {getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth,} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {defineCustomElements} from '@ionic/pwa-elements/loader';
import {enableProdMode} from "@angular/core";
import {Capacitor} from "@capacitor/core";
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);
if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        // {provide: LocationStrategy, useClass: HashLocationStrategy},
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirebaseApp(() => {
            const app = initializeApp(environment.firebaseConfig);
            if (Capacitor.isNativePlatform()) {
                initializeAuth(app, {
                    persistence: indexedDBLocalPersistence,
                });
            }
            return app;
        }),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
    ],
});
