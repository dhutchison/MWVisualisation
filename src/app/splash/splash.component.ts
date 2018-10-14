import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
import { DataAccessService } from '../data/data-access.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  readonly title = 'MW-Visualisation';

  constructor(
    private _dataAccessService: DataAccessService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._dataAccessService.fileOpen.subscribe((value: boolean) => {
      console.log("Database loaded?")
      console.log(value);
      if(value) {
        this._router.navigate(
          [ 'reports' ]
        );
      }
    });
  }

}
