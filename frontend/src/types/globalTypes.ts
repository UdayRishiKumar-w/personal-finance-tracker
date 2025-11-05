export type ThemeMode = "light" | "dark";

export interface LanguageOption {
	language: string;
	code: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface TransactionData {
	id?: number;
	title: string;
	amount: number;
	date: string;
	category?: string;
	type: TransactionType;
	description?: string;
	recurring?: boolean;
}
