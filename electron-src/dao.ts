import { Database } from 'sqlite3';

export class MoneyWellDAO {

    private db:Database;

    constructor(dbFilePath: string) {
        this.db = new Database(dbFilePath, (err) => {
          if (err) {
              console.log('Could not connect to database', err)
          } else {
              console.log('Connected to database')
          }
        });
    }

    loadTransactions() {
        return this.get("SELECT Z_PK, ZDATEYMD, ZAMOUNT, ZPAYEE FROM ZACTIVITY")
          .then(value => {
            console.log(value);
          });
    //   while (statement.step()) {
    //     let row = statement.getAsObject();

    //     transactions.push({id: row.Z_PK, date: new Date(row.ZDATEYMD), payee: row.ZPAYEE});
    //   }
    }

    get(sql: string, params: any[] = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err: any, result: any) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      }
    
      all(sql:string, params:any[] = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err: Error, rows: any) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
      }

}