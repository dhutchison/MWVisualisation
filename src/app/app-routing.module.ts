import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { SplashComponent } from './splash/splash.component';

const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' }
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
