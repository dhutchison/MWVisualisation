import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataAccessModule } from './data-access/data-access.module';
import { SplashModule } from './splash/splash.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DataAccessModule,
    SplashModule,

    BrowserModule,
    BrowserAnimationsModule,

    /* Routing support */
    AppRoutingModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
