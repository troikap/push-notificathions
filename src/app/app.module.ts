import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Authconfig } from './core/providers/interceptor/authconfig.provider';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as SentrySibling from "@sentry/angular-ivy";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mecubrodb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: Authconfig, multi: true },
    { provide: ErrorHandler, useValue: SentrySibling.createErrorHandler() },
    {
      provide: SentrySibling.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [SentrySibling.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
