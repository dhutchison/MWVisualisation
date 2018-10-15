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

    loadTransactions(
      params: {
        dateRange: {start: Date, end: Date}, 
        accounts: {id: number, name: string}[]
      }): Promise<{id: number, date: Date, payee: String}[]> {

        let queryParams: any[] = this.getParamArray(params);

        let query: string = 
          'SELECT Z_PK as id, ZDATEYMD as date, ZAMOUNT, ZPAYEE as payee ' + 
          'FROM ZACTIVITY ' + 
          'WHERE ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
          (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') + 
          (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') + 
          'ORDER BY ZDATEYMD DESC'

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadTransactionInOutSummary(
        params: {
          dateRange: {start: Date, end: Date}, 
          accounts: {id: number, name: string}[]
        }
      ): Promise<{id: number, moneyIn: number, moneyOut: number}[]> {

        let queryParams: any[] = this.getParamArray(params);

        let query = 
          'SELECT ZACCOUNT2 as id, ' +  
          'SUM(case when ZAMOUNT > 0 then ZAMOUNT else 0 end) moneyIn, ' + 
          'SUM(case when ZAMOUNT < 0 then (ZAMOUNT * -1) else 0 end) moneyOut ' + 
          'FROM ZACTIVITY ' + 
          'WHERE ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
          (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') + 
          (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') + 
          'GROUP BY ZACCOUNT2';

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadBucketInOutSummary(
      params: {
        dateRange: {start: Date, end: Date}, 
        accounts: {id: number, name: string}[]
      }
    ): Promise<{id: number, moneyIn: number, moneyOut: number}[]> {

      let queryParams: any[] = this.getParamArray(params);

      let query = 
        'SELECT ZBUCKET2 as id, ' +  
        'SUM(case when ZAMOUNT > 0 then ZAMOUNT else 0 end) moneyIn, ' + 
        'SUM(case when ZAMOUNT < 0 then (ZAMOUNT * -1) else 0 end) moneyOut ' + 
        'FROM ZACTIVITY '
        'WHERE ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
        (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') + 
        (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') + 
        'GROUP BY ZBUCKET2';

      console.log(query);
      console.log(queryParams);

      return this.all(query, queryParams);
  }

    loadAccounts(): Promise<{id: number, name: string}[]> {
      return this.all(
        'SELECT Z_PK as id, ZNAME as name '+ 
        'FROM ZACCOUNT'
      );
    }

    loadBuckets(): Promise<{id: number, name: string}[]> {
      return this.all(
        'SELECT Z_PK AS id, ZNAME AS name ' + 
        'FROM ZBUCKET ' + 
        'ORDER BY ZNAME COLLATE NOCASE'
      );
    }

    private getParamArray(
        params: {
          dateRange: {start: Date, end: Date}, 
          accounts: {id: number, name: string}[]
        }
      ): any[] {

        let queryParams: any[] = [];

        params.accounts.forEach(value => {
          queryParams.push(value.id);
        });

        if (params.dateRange) {
          if (params.dateRange.start) {
            queryParams.push(params.dateRange.start);
          }
          if (params.dateRange.end) {
            queryParams.push(params.dateRange.end);
          }
        }

        return queryParams;

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