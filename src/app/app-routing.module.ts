import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { SplashComponent } from './splash/splash.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'reports', component: ReportsComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
