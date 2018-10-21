import { Database } from 'sqlite3';
import { Account, Bucket, Transaction, TransactionFilter, InOutSummary, DateTotal, TransactionStatus, TransactionType } from './model';

/* Notes:

Attempt at getting a total:
select a.Z_PK as id, a.ZNAME as name,
TOTAL(ZAMOUNT) as balance
from ZACCOUNT a
INNER JOIN ZACTIVITY t ON a.Z_PK = t.ZACCOUNT2
WHERE a.ZINCLUDEINNETWORTH=1
AND ZSTATUS > 0
AND a.Z_PK = 1
and zdateymd >= '20090501'
and zdateymd < '20090503'
GROUP BY a.Z_PK

This does not compute correctly, due to a split transaction. Individual parts of the split are 
included in the above, so are double counted (parent and children).
Field ZSPLITPARENT contains the ID of the parent transaction (so exlude non-null values for totals)

Final query for accounts and balances is:
select a.Z_PK as id, a.ZNAME as name,
ROUND(TOTAL(ZAMOUNT), 2) as balance
from ZACCOUNT a
INNER JOIN ZACTIVITY t ON a.Z_PK = t.ZACCOUNT2
WHERE a.ZINCLUDEINNETWORTH=1
-- Exclude voided
AND ZSTATUS > 0
AND ZSPLITPARENT IS NULL
--and zdateymd < '20090504'
GROUP BY a.Z_PK
*/

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
      params: TransactionFilter
    ): Promise<Transaction[]> {

        let queryParams: any[] = this.getParamArray(params);

        let query: string = 
          'SELECT Z_PK as id, ZDATEYMD as date, ZAMOUNT, ZPAYEE as payee, ' + 
          'ZAMOUNT as amount ' + 
          'FROM ZACTIVITY ' + 
          'WHERE ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
          (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') + 
          (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') + 
          'ORDER BY ZDATEYMD DESC'

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadAccountInOutSummary(
        params: TransactionFilter
      ): Promise<InOutSummary[]> {

        let queryParams: any[] = this.getParamArray(params);

        let query = 
          'SELECT t.ZACCOUNT2 as id, a.ZNAME as name, ' +  
          'SUM(case when t.ZAMOUNT > 0 then t.ZAMOUNT else 0 end) moneyIn, ' + 
          'SUM(case when t.ZAMOUNT < 0 then (t.ZAMOUNT * -1) else 0 end) moneyOut ' + 
          'FROM ZACTIVITY t ' + 
          'INNER JOIN ZACCOUNT a ON t.ZACCOUNT2 = a.Z_PK ' + 
          'WHERE t.ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
          (params.dateRange && params.dateRange.start ? ' AND t.ZDATEYMD >= ? ' : '') + 
          (params.dateRange && params.dateRange.end ? ' AND t.ZDATEYMD <= ? ' : '') + 
          'AND ZSPLITPARENT IS NULL ' + 
          'GROUP BY t.ZACCOUNT2';

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadBucketInOutSummary(
      params: TransactionFilter
    ): Promise<InOutSummary[]> {

      let queryParams: any[] = this.getParamArray(params);

      let query = 
        'SELECT t.ZBUCKET2 as id, b.ZNAME as name, ' +  
        'SUM(case when t.ZAMOUNT > 0 then t.ZAMOUNT else 0 end) moneyIn, ' + 
        'SUM(case when t.ZAMOUNT < 0 then (t.ZAMOUNT * -1) else 0 end) moneyOut ' + 
        'FROM ZACTIVITY t ' + 
        'INNER JOIN ZBUCKET b ON t.ZBUCKET2 = b.Z_PK ' + 
        'WHERE t.ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
        (params.dateRange && params.dateRange.start ? ' AND t.ZDATEYMD >= ? ' : '') + 
        (params.dateRange && params.dateRange.end ? ' AND t.ZDATEYMD <= ? ' : '') + 
        'GROUP BY t.ZBUCKET2';

      console.log(query);
      console.log(queryParams);

      return this.all(query, queryParams);
  }

  loadAccounts(): Promise<Account[]> {
    return this.all(
      'SELECT Z_PK AS id, ZNAME AS name, ZTYPE AS type '+ 
      'FROM ZACCOUNT'
    );
  }

  loadBuckets(): Promise<Bucket[]> {
    return this.all(
      'SELECT Z_PK AS id, ZNAME AS name ' + 
      'FROM ZBUCKET ' + 
      'ORDER BY ZNAME COLLATE NOCASE'
    );
  }

  loadAccountsWithBalance(onDate?: string): 
    Promise<Account[]> {

    let params: any[] = [TransactionStatus.Voided];
    if (onDate) {
      params.push(onDate);
    }

    let query: string = 
      'SELECT a.Z_PK AS id, a.ZNAME AS name, a.ZTYPE AS type, ' + 
      'ROUND(TOTAL(t.ZAMOUNT), 2) AS balance ' + 
      'FROM ZACCOUNT a ' + 
      'INNER JOIN ZACTIVITY t ON a.Z_PK = t.ZACCOUNT2 ' + 
      /* Exclude voided */
      'WHERE t.ZSTATUS != ? ' + 
      'AND t.ZSPLITPARENT IS NULL ' + 
      ((onDate) ? 'AND t.ZDATEYMD < ? ' : '') + 
      'GROUP BY a.Z_PK';

    return this.all(query, params);

  }

  loadDailyTransactionTotals(
    params: TransactionFilter
  ): Promise<DateTotal[]> {

    let queryParams: any[] = this.getParamArray(params);
    queryParams.push(TransactionStatus.Voided);

    let query = 
      'SELECT ZDATEYMD AS date, ' + 
      'ROUND(TOTAL(ZAMOUNT), 2) AS total ' + 
      'FROM ZACTIVITY ' +
      'WHERE ZSPLITPARENT IS null ' +
      'AND ZACCOUNT2 in ( ' + params.accounts.map(() => {return '?'}).join(',')+ ')' + 
      (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') + 
      (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') + 
      'AND ZSTATUS != ? ' + 
      'GROUP BY ZDATEYMD ' + 
      'ORDER BY ZDATEYMD';

    console.log(query);
    console.log(queryParams);

    return this.all(query, queryParams);

  }



  private getParamArray(
    params: TransactionFilter
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

  private all(sql: string, params: any[] = []): Promise<any[]> {
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