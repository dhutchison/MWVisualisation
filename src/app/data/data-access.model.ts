export class Account {
    id: number;
    name: string;
}

export class DateRange {
    start: string;
    end: string;
}

export class TransactionFilter {
    dateRange?: DateRange;
    accounts?: Account[];
}

export class Transaction {
    id: number;
    date: Date;
    amount: number;
    payee: String;
}