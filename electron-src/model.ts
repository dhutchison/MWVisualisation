/* TODO: This should be a shared file between the electron and Angular parts */

export class Account {
    id: number;
    name: string;
    balance?: number
}

export class Bucket {
    id: number;
    name: string;
}

export class DateRange {
    start: string;
    end: string;
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
    payee: String;
}

export class TransactionFilter {
    dateRange?: DateRange;
    accounts?: Account[];
}