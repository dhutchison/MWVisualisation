/* TODO: This should be a shared file between the electron and Angular parts */

export class Account {
    id: number;
    name: string;
    type: AccountType;
    balance?: number
}

/* ZTYPE field in ZACCOUNT is the account type */
export enum AccountType {
    Checking = 0,
    Savings = 1,
    Credit = 2
    //TODO: There are other account types
}

export class Bucket {
    id: number;
    name: string;
}

export class DateRange {
    start: string;
    end: string;
}

export class DateTotal {
    date: string;
    total: number;
}

export class DailyWorth {
    initialBalance: number;
    dailyWorth: DateTotal[];
}

export class InOutSummary {
    id: number;
    name: string;
    moneyIn: number;
    moneyOut: number;
}

export class Transaction {
    id: number;
    date: Date;
    amount: number;
    payee: string;
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