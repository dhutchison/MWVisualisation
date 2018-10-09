import { Database } from 'sqlite3';

export class MoneyWellDAO {

    private db:Database;

    constructor(private dbFilePath: string) { }

    connect(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.db = new Database(this.dbFilePath, (err) => {
          if (err) {
              console.log('Could not connect to database', err)
              reject(err);
          } else {
              console.log('Connected to database')
              resolve();
          }
        });
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

    loadAccounts(): Promise<{id: number, name: string}[]> {
      return this.all("SELECT Z_PK as id, ZNAME as name FROM ZACCOUNT");
    }

    private get(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err: any, result: any) => {
            if (err) {
              console.error('Error running sql: ' + sql)
              console.error(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      }
    
      private all(sql:string, params:any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err: Error, rows: any) => {
            if (err) {
              console.error('Error running sql: ' + sql)
              console.error(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
      }

}