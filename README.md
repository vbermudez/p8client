# P8Client - IN DEVELOPMENT -

Simple and thin IBM FileNet P8 Client for NodeJS

## Install
Install using:
```shellscript
npm install --save https://github.com/vbermudez/p8client.git
```
or, directly adding a dependency to your _package.json_:
```json
{
	"dependencies": {
		"P8Client": "git+https://github.com/vbermudez/p8client.git"
	}
}
```

## Supports
- Document row and object search
- Document download

## Usage
```JavaScript
const P8Client = require('p8client');
let P8Search = require('p8search');

const p8 = new P8Client('http://<filenet.server.url>:<port>');
const client = await p8.connect('username', 'password');
let searchOpts = new P8Search();

searchOpts.objectStore = '<objectStoreID>';
searchOpts.query = "select * from Document where DocumentTitle like '%test%'";
searchOpts.searchRows = true;

let results = await client.search(searchOpts);

for (let i = 0, len = result.rows.length; i < len; i++) {
	let doc = result.rows[i];
	
	console.log(`Found ${doc.DocumentTitle} with id ${doc.Id.value}`);
}

searchOpts.query = "select This, * from Document where DocumentTitle like '%test%'";
searchOpts.searchRows = false;

results = await client.search(searchOpts);

if (result.rows.length > 0) {
	let doc = result.rows[0].This;
	let contentElements = await doc.download();

	console.log(`Mime Type = ${contentElements[0].mime}`);
	console.log(`Binary = ${contentElements[0].data}`);
}
```
