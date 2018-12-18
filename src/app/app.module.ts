import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
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
    FlexLayoutModule,

    /* Routing support */
    AppRoutingModule,

    LayoutModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
