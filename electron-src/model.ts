/* TODO: This should be a shared file between the electron and Angular parts */

export class Account {
    id: number;
    currencyCode: string;
    name: string;
    type: AccountType;
    balance?: number
}

/* ZTYPE field in ZACCOUNT is the account type */
export enum AccountType {
    Checking = 0,
    Savings = 1,
    Credit = 2,
    Loan = 3,
    Investment = 4,
    Cash = 5,
    MoneyMarket = 6
}

export class Bucket {
    id: number;
    name: string;
    type: BucketType;
}

/* ZTYPE field in ZBUCKET is the bucket type */
export enum BucketType {
    Income = 1,
    Expense = 2
}

export class DateRange {
    start: string;
    end: string;
}

export class DateTotal {
    date: string;
    total: number;
}

export class InOutSummary {
    id: number;
    name: string;
    moneyIn: number;
    moneyOut: number;
}

export class NetWorth {
    initialBalance: number;
    dataPoints: DateTotal[];
}

export enum TimePeriod {
    DAY,
    WEEK,
    MONTH,
    YEAR
}

export class Transaction {
    id: number;
    date: Date;
    amount: number;
    accountId: number;
    payee: string;
    status: TransactionStatus;
    type: TransactionType;

    bucketId: number;
    memo: string;
    tags: number[] = [];
    transferToAccountId: number;
}

export class TransactionFilter {
    dateRange?: DateRange;
    accounts?: Account[];
}

/* ZTYPE field in ZACTIVITY is the transaction type */
export enum TransactionType {
    Deposit = 0,
    Withdrawal = 1,
    /*  Note this value has an additional associated Reference field, ZCHECKREF */
    Check = 2 
}

/* ZSTATUS field in ZACTIVITY is the transaction status */
export enum TransactionStatus {
    Voided = 0,
    Reconsiled = 1,
    Cleared = 2,
    Open = 3,
    Pending = 4
}

export class TrendData {
    label: string;
    dataPoints: DateTotal[];
}