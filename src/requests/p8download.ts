'use strict';

export class P8DownloadRequest {
	private _classId: string;
	private _objectId: string;
	private _objectStore: string;
	private _cacheAllowed: boolean;
	private _maxBytes: number;
	private _validateOnly: boolean;
	private _itemIndex: number;
	private _continuable: boolean;

	constructor() {
		this._classId = null;
		this._objectId = null;
		this._objectStore = null;
		this._cacheAllowed = false;
		this._maxBytes = 1000000;
		this._validateOnly = false;
		this._itemIndex = 0;
		this._continuable = false;
	}

	public get classId(): string { return this._classId; }
	public set classId(value: string) { this._classId = value; }

	public get objectId(): string { return this._objectId; }
	public set objectId(value: string) { this._objectId = value; }

	public get objectStore(): string { return this._objectStore; }
	public set objectStore(value: string) { this._objectStore = value; }

	public get cacheAllowed(): boolean { return this._cacheAllowed; }
	public set cacheAllowed(value: boolean) { this._cacheAllowed = value; }

	public get maxBytes(): number { return this._maxBytes; }
	public set maxBytes(value: number) { this._maxBytes = value; }

	public get validateOnly(): boolean { return this._validateOnly; }
	public set validateOnly(value: boolean) { this._validateOnly = value; }

	public get itemIndex(): number { return this._itemIndex; }
	public set itemIndex(value: number) { this.itemIndex = value; }

	public get continuable(): boolean { return this._continuable; }
	public set continuable(value: boolean) { this.continuable = value; }

	public build(): any {
		if (!this.objectStore || !this.classId || !this.objectId) {
			throw new Error('The ObjectStoreID, the ClassID and the ObjectID are mandatory');
		}
		
		return {
			$attributes: {
				validateOnly: this.validateOnly
			},
			ContentRequest: {
				$attributes: {
					id: '1',
					cacheAllowed: this.cacheAllowed,
					maxBytes: 1000000,
					continuable: this.continuable
				},
				SourceSpecification: {
					$attributes: {
						classId: this.classId,
						objectId: this.objectId,
						objectStore: this.objectStore
					}
				},
				ElementSpecification: {
					$attributes: {
						itemIndex: this.itemIndex
					}
				}
			}
		};
	}
}
