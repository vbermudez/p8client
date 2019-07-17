export class P8SearchRequest {
	private _objectStore: string;
	private _searchRows: boolean;
	private _maxElements: number;
	private _continuable: boolean;
	private _query: string;
	private _locale: string;
	
	constructor() {
		this._objectStore = null;
		this._searchRows = true;
		this._maxElements = 0;
		this._continuable = true;
		this._query = null;
		this._locale = 'en-US';
	}

	public get objectStore(): string { return this._objectStore; }
	public set objectStore(value: string) { this._objectStore = value; }

	public get searchRows(): boolean { return this._searchRows; }
	public set searchRows(value: boolean) { this._searchRows = value; }

	public get maxElements(): number { return this._maxElements; }
	public set maxElements(value: number) { this._maxElements = value; }

	public get continuable(): boolean { return this._continuable; }
	public set continuable(value: boolean) { this._continuable = value; }

	public get query(): string { return this._query; }
	public set query(value: string) { this._query = value; }

	public get locale(): string { return this._locale; }
	public set locale(value: string) { this._locale = value; }

	public build = function(): any {
		if (!this.objectStore || !this.query) {
			throw new Error('The ObjectStoreID and the Query are mandatory');
		}
		
		return {
			$attributes: {
				'xsi:type': 'RepositorySearch',
				repositorySearchMode: this.searchRows ? 'Rows' : 'Objects',
				maxElements: this.maxElements,
				continuable: this.continuable
			},
			SearchScope: {
				$attributes: {
					'xsi:type': 'ObjectStoreScope',
					objectStore: this.objectStore
				}
			},
			SearchSQL: this.query
		};
	}
}
