'use strict';

export type RowProperty = {
	name: string,
	type: string,
	value: any,
	settable?: boolean;
}

export type ResultRow = {
	This?: any
} & {
	[prop: string]: RowProperty,
}

export type SearchResults = {
	rows: Array<ResultRow>
}