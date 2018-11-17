import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAccessService } from './data-access.service';
import { NgxElectronModule, ElectronService } from 'ngx-electron';

@NgModule({
  imports: [
    CommonModule,
    NgxElectronModule
  ],
  exports: [
    
  ],
  declarations: [],
  providers: [
    DataAccessService,
    ElectronService
  ]
})
export class DataAccessModule { }
