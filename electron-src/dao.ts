import { Database, Statement } from 'sqlite3';
import {
    Account,
    Bucket,
    Transaction,
    TransactionFilter,
    InOutSummary,
    DateTotal,
    TransactionStatus,
    TransactionType,
    TimePeriod,
    TrendData,
    TrendFilter,
    BucketType,
    TrendFilterGroup
  } from './model';

/* Notes:

This SQLITE DB is created by the iOS Core Data framework, so there
are some standard columns in each table:
(From https://stackoverflow.com/questions/8448338/what-is-z-ent-column-in-sqlite-database-that-gets-created-by-core-data)
* Z_OPT is for how many times the record has been altered
* Z_PK is the unique id for each
* Z_ENT is their entity id (same as what’s listed in the Z_PRIMARYKEY table

ZACTIVITY has two columns holding the currency for a transaction:
- zsalecurrencycode
- zsalecurrencycode1
The latter seems to be the correct one, the former is only populated for a few
transactions with a null ZSTATUS
BUT this does not appear to be a field which is in the UI.
Just going to use the account currency (ZCURRENCYCODE in ZACCOUNT)

Transfers between accounts are indicated in the ZACTIVITY table by the ZTRANSFERSIBLING
column. This holds the Z_PK value for the transaction which it is linked to.
The direction of the tranfer is dictated by the amount and by no other column.
The source is the transaction with the negative amount, and the destination the transaction
with the positive amount.

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

    private db: Database;

    constructor(private dbFilePath: string) { }

    connect(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.db = new Database(this.dbFilePath, (err) => {
          if (err) {
              console.log('Could not connect to database', err);
              reject(err);
          } else {
              console.log('Connected to database');
              resolve();
          }
        });
      });
    }

  disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err: Error) => {
          if (err) {
            console.log('Could not close database', err);
            reject(err);
          } else {
            console.log('Disconnected from database');
            this.db = undefined;
            resolve();
          }
        });
      } else {
        console.log('Database not open');
        resolve();
      }
    });
  }

    loadTransactions(
      params: TransactionFilter
    ): Promise<Transaction[]> {

        const queryParams: any[] = this.getParamArray(params);

        const query: string =
          'SELECT Z_PK AS id, ZDATEYMD AS date, ZAMOUNT, ZPAYEE AS payee, ' +
          'ZACCOUNT2 AS accountId, ' +
          'ZAMOUNT AS amount, ZSTATUS AS status, ZTYPE AS type, ' +
          'ZBUCKET2 AS bucketId, ZMEMO AS memo ' +
          'FROM ZACTIVITY ' +
          'WHERE ZACCOUNT2 in ( ' + params.accounts.map(() => '?').join(',') + ')' +
          (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') +
          (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') +
          'ORDER BY ZDATEYMD DESC';

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadTransactionTrend(trendFilter: TrendFilter): Promise<TrendData[]> {

      /* Setup the query parameters */
      const queryParams: any[] = [];
      queryParams.push(TransactionStatus.Voided);
      queryParams.push(trendFilter.startDate);
      if (trendFilter.groupingFilter) {
        queryParams.push(trendFilter.groupingFilter);
      }

      /* Setup the grouping part of the query for the time period */
      let dateQueryPart: string;
      switch (trendFilter.timePeriod) {
        case TimePeriod.DAY:
          dateQueryPart = 't.ZDATEYMD';
          break;
        case TimePeriod.WEEK:
          dateQueryPart =
            '(substr(t.ZDATEYMD, 1, 4) || \'/\' || ' +
            'strftime(\'%W\', (substr(t.ZDATEYMD, 1, 4) || \'-\' || ' +
            'substr(t.ZDATEYMD, 5, 2) || \'-\' || substr(t.ZDATEYMD, 7) )))';
          break;
        case TimePeriod.MONTH:
          dateQueryPart = 'substr(t.ZDATEYMD, 0, length(t.ZDATEYMD) -1)';
          break;
        case TimePeriod.YEAR:
          dateQueryPart = 'substr(t.ZDATEYMD, 0, length(t.ZDATEYMD) -3)';
          break;
      }

      let query = 'SELECT ';

      if (trendFilter.grouping === TrendFilterGroup.Bucket) {
        query += 'IFNULL(b.Z_PK, -1) AS groupId, IFNULL(b.ZNAME, \'(No Bucket)\') AS groupName, ';
      } else if (trendFilter.grouping === TrendFilterGroup.Bucket_Group) {
        query += 'IFNULL(bg.Z_PK, -1) AS groupId, IFNULL(bg.ZNAME, \'(No Bucket Group)\') AS groupName, ';
      } else if (trendFilter.grouping === TrendFilterGroup.Account) {
        query += 'a.Z_PK as groupId, a.ZNAME as groupName, ';
      } else if (trendFilter.grouping === TrendFilterGroup.Account_Group) {
        query += 'IFNULL(ag.Z_PK, -1) AS groupId, IFNULL(ag.ZNAME, \'(No Account Group)\') AS groupName, ';
      } else if (trendFilter.grouping === TrendFilterGroup.ALL) {
        query += '-1 AS groupId, \'Total\' AS groupName, ';
      }

      query += dateQueryPart + ' AS date, ' +
        'ROUND(TOTAL(t.ZAMOUNT), 2) AS total ' +
        'FROM ZACTIVITY t ' +
        'LEFT OUTER JOIN ZBUCKET b ON b.Z_PK = t.ZBUCKET2 ' +
        'LEFT OUTER JOIN ZBUCKETGROUP bg ON b.ZBUCKETGROUP = bg.Z_PK ' + 
        'INNER JOIN ZACCOUNT a ON t.ZACCOUNT2 = a.Z_PK AND a.ZINCLUDEINCASHFLOW=1 ' +
        'LEFT OUTER JOIN ZACCOUNTGROUP ag ON a.ZACCOUNTGROUP = ag.Z_PK ' + 
        /* we only want to include transfers if they are to an account not 
         * being included in the cash flow */
        'LEFT OUTER JOIN ZACTIVITY t2 ON t.ZTRANSFERSIBLING = t2.Z_PK ' + 
        'LEFT OUTER JOIN ZACCOUNT a2 ON t2.ZACCOUNT2 = a2.Z_PK AND a2.ZINCLUDEINCASHFLOW=1 ' +

        /* Where condititions */
        'WHERE t.ZSTATUS != ?  ' +
        'AND t.ZDATEYMD > ? ' + 
        'AND a2.Z_PK IS NULL ';

      if (trendFilter.groupingFilter) {
        // TODO: Rename as bucketTypeFilter
        // if (trendFilter.grouping === TrendFilterGroup.Bucket) {
         query += 'AND b.ZTYPE = ? ';
        // }
      }

      query +=
        'GROUP BY groupId, ' + dateQueryPart + ' ' +
        'ORDER BY t.ZDATEYMD';

      console.log('Loading income trend data');
      console.log(query);
      console.log(queryParams);

      const results = new Map<number, TrendData>();

      return new Promise((resolve, reject) => {
        this.db.each(query, queryParams,
          (err: Error, row: any) => {

            let groupData: TrendData = results.get(row.groupId);
            if (groupData === undefined) {
              /* Not seen this bucket before, create the holder object */
              groupData = new TrendData();
              groupData.label = row.groupName;
              groupData.dataPoints = [];

              results.set(row.groupId, groupData);
            }

            const dateTotal = new DateTotal();
            dateTotal.date = row.date;
            dateTotal.total = row.total;

            groupData.dataPoints.push(dateTotal);

          }, (err: Error, count: number) => {
            if (err) {
              console.error('Error running sql: ' + query);
              console.error(err);
              reject(err);
            } else {
              const resultRows: TrendData[] = [];
              results.forEach(value => resultRows.push(value));

              resolve(resultRows);
            }
          });
       });
    }

    loadAccountInOutSummary(
        params: TransactionFilter
      ): Promise<InOutSummary[]> {

        const queryParams: any[] = this.getParamArray(params);

        const query =
          'SELECT t.ZACCOUNT2 as id, a.ZNAME as name, ' +
          'SUM(case when t.ZAMOUNT > 0 then t.ZAMOUNT else 0 end) moneyIn, ' +
          'SUM(case when t.ZAMOUNT < 0 then (t.ZAMOUNT * -1) else 0 end) moneyOut ' +
          'FROM ZACTIVITY t ' +
          'INNER JOIN ZACCOUNT a ON t.ZACCOUNT2 = a.Z_PK ' +
          'WHERE t.ZACCOUNT2 in ( ' + params.accounts.map(() => '?').join(',') + ')' +
          (params.dateRange && params.dateRange.start ? ' AND t.ZDATEYMD >= ? ' : '') +
          (params.dateRange && params.dateRange.end ? ' AND t.ZDATEYMD <= ? ' : '') +
          /* Exclude the parent of any split transactions to avoid double counting */
          'AND ZSPLITPARENT IS NULL ' +
          'GROUP BY t.ZACCOUNT2';

        console.log(query);
        console.log(queryParams);

        return this.all(query, queryParams);
    }

    loadBucketInOutSummary(
      params: TransactionFilter
    ): Promise<InOutSummary[]> {

      const queryParams: any[] = this.getParamArray(params);

      const query =
        'SELECT t.ZBUCKET2 AS id, b.ZNAME AS name, b.ZTYPE AS type, ' +
        'SUM(case when t.ZAMOUNT > 0 then t.ZAMOUNT else 0 end) moneyIn, ' +
        'SUM(case when t.ZAMOUNT < 0 then (t.ZAMOUNT * -1) else 0 end) moneyOut ' +
        'FROM ZACTIVITY t ' +
        'INNER JOIN ZBUCKET b ON t.ZBUCKET2 = b.Z_PK ' +
        'WHERE t.ZACCOUNT2 in ( ' + params.accounts.map(() => '?').join(',') + ')' +
        (params.dateRange && params.dateRange.start ? ' AND t.ZDATEYMD >= ? ' : '') +
        (params.dateRange && params.dateRange.end ? ' AND t.ZDATEYMD <= ? ' : '') +
        'GROUP BY t.ZBUCKET2';

      console.log(query);
      console.log(queryParams);

      return this.all(query, queryParams);
  }

  loadAccounts(): Promise<Account[]> {
    return this.all(
      'SELECT Z_PK AS id, ZNAME AS name, ZTYPE AS type, ZCURRENCYCODE AS currencyCode ' +
      'FROM ZACCOUNT'
    );
  }

  loadBuckets(): Promise<Bucket[]> {
    return this.all(
      'SELECT Z_PK AS id, ZNAME AS name, ZTYPE AS type ' +
      'FROM ZBUCKET ' +
      'ORDER BY ZNAME COLLATE NOCASE'
    );
  }

  loadAccountsWithBalance(onDate?: string, restrictToNetWorth?: boolean): Promise<Account[]> {

    const params: any[] = [TransactionStatus.Voided];
    if (onDate) {
      params.push(onDate);
    }

    const query: string =
      'SELECT a.Z_PK AS id, a.ZNAME AS name, a.ZTYPE AS type, a.ZCURRENCYCODE AS currencyCode, ' +
      'ROUND(TOTAL(t.ZAMOUNT), 2) AS balance ' +
      'FROM ZACCOUNT a ' +
      'INNER JOIN ZACTIVITY t ON a.Z_PK = t.ZACCOUNT2 ' +
      /* Exclude voided */
      'WHERE t.ZSTATUS != ? ' +
      'AND t.ZSPLITPARENT IS NULL ' +
      ((onDate) ? 'AND t.ZDATEYMD < ? ' : '') +
      ((restrictToNetWorth) ? 'AND a.ZINCLUDEINNETWORTH=1 ' : '') + 
      'GROUP BY a.Z_PK';

    return this.all(query, params);

  }

  loadDailyTransactionTotals(
    params: TransactionFilter
  ): Promise<DateTotal[]> {

    const queryParams: any[] = this.getParamArray(params);
    queryParams.push(TransactionStatus.Voided);

    const query =
      'SELECT ZDATEYMD AS date, ' +
      'ROUND(TOTAL(ZAMOUNT), 2) AS total ' +
      'FROM ZACTIVITY ' +
      'WHERE ZSPLITPARENT IS null ' +
      'AND ZACCOUNT2 in ( ' + params.accounts.map(() => '?').join(',') + ')' +
      (params.dateRange && params.dateRange.start ? ' AND ZDATEYMD >= ? ' : '') +
      (params.dateRange && params.dateRange.end ? ' AND ZDATEYMD <= ? ' : '') +
      'AND ZSTATUS != ? ' +
      'GROUP BY ZDATEYMD ' +
      'ORDER BY ZDATEYMD';

    console.log(query);
    console.log(queryParams);

    return this.all(query, queryParams);

  }

  /**
   * Method to load statistics for any accounts with "mortgage" in the name. 
   * 
   * This makes a few assumptions, to make up for a lack of information stored in the source
   * data set:
   * 1. The expected mortgage end date will be marked with a transaction with the name "END"
   *    with a zero amount
   * 2. The approach to estimating what the interest rates applied will be a bit crude.
   *    This assumes any withdrawal type transactions are for interest
   *    This assumes any interest transaction will be on the last day of the month
   *    This is calculated by taking 12 interest transactions and working out two
   *    pieces of information: the daily interest, and the amount the daily interest decreases
   *    per month.
   * 
   * 
   * TODO: Develop
   */
  private loadMortgageStatistics() {

    /* Load the transactions for any mortgage accounts to give our balance trend. 
       This will aggregate any transactions which occurred on the same day.
    */
    const transactionQuery = 
      'SELECT a.Z_PK AS accountId, a.ZNAME AS accountName, ' +
      't.ZDATEYMD AS transactionDate, SUM(t.ZAMOUNT) AS dailyTransactionTotal ' +
      'FROM ZACTIVITY t ' +
      'INNER JOIN ZACCOUNT a ON t.ZACCOUNT2 = a.Z_PK AND a.ZNAME LIKE \'%MORTGAGE%\' ' +
      'GROUP BY a.Z_PK, t.ZDATEYMD ' +
      'ORDER BY a.Z_PK, t.ZDATEYMD';


      /* For a single account, get the last 12 interest amounts */
      const accountInterestQuery = 
        'SELECT t.ZDATEYMD AS transactionDate, SUM(t.ZAMOUNT) AS dailyTransactionTotal ' +
        'FROM ZACTIVITY t ' +
        'INNER JOIN ZACCOUNT a ON t.ZACCOUNT2 = a.Z_PK AND a.ZNAME LIKE \'%MORTGAGE%\' ' +
        'WHERE t.ZTYPE=1 ' +
        'AND t.ZDATEYMD < CAST(strftime(\'%Y%m%d\', \'now\') AS int) ' +
        'AND t.ZACCOUNT2 = 8 ' +
        'GROUP BY a.Z_PK, t.ZDATEYMD ' +
        'ORDER BY a.Z_PK, t.ZDATEYMD DESC ' +
        'LIMIT 12';

  }



  private getParamArray(
    params: TransactionFilter
  ): any[] {

    const queryParams: any[] = [];

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
          console.error('Error running sql: ' + sql);
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error, rows: any) => {
        if (err) {
          console.error('Error running sql: ' + sql);
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

}
