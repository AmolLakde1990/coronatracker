export interface GlobalDataSummary {
    country?: string;
    confirmed?: number;
    deaths?: number;
    recovered?: number;
    active?: number;
}

export interface DateWiseData {
    date?: Date;
    cases?: number;
    country?: string;
}
