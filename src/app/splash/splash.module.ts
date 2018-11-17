import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { SplashComponent } from './splash.component';

@NgModule({
  imports: [
    CommonModule,

    /* Angular Material Components */
    MatIconModule
  ],
  declarations: [
    SplashComponent
  ]
})
export class SplashModule { }
