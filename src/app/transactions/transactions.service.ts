import { Injectable } from '@angular/core';
import { Transaction } from './shared/transaction.model';

import { Observable, of } from 'rxjs';

declare let electron: any;

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  dbFilePath: string = '/Users/david/Documents/Bank/MW_Visualisation/persistentStore'
  private ipc = electron.ipcRenderer;

  constructor() { 
    
    // let filebuffer = fs.readFileSync(this.dbFilePath);
    // this.db = new SQL.Database(filebuffer);
  }

  configureDB(file: File) {
    console.log(file);
    this.ipc.send("databaseFileSelected", 'ping')
    // let reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = () => {
    //   var Uints = new Uint8Array(<ArrayBuffer>reader.result);
    //   this.db = new SQL.Database(Uints);
    // };
  }

  getTransactions(): Observable<Transaction[]> {

    // let statement = this.db.prepare("SELECT Z_PK, ZDATEYMD, ZAMOUNT, ZPAYEE FROM ZACTIVITY");
    // statement.bind()

    // let transactions: Transaction[] = [];
    // while (statement.step()) {
    //   let row = statement.getAsObject();

    //   transactions.push({id: row.Z_PK, date: new Date(row.ZDATEYMD), payee: row.ZPAYEE});
    // }


    

    let transactions: Transaction[] = [
      { id: 1, date: new Date(2018, 10, 1), payee: 'Somebody'}
    ];

    return of(transactions);
  }
}
