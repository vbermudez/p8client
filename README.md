# P8Client

Simple and thin IBM FileNet P8 Client for Node.js

##Install
Install using:
```shellscript
npm install --save https://github.com/vbermudez/p8client.git
```
or:
```json
{
	"dependencies": {
		"P8Client": "git+https://github.com/vbermudez/p8client.git"
	}
}
```

##Usage
```JavaScript
var P8Client = require('p8client')
var P8Search = require('p8search')
var p8 = new P8Client('http://<filenet.server.url>:<port>')

p8.connect('username', 'password', function(err, client) {
	if (err) {
		return console.log(err)
	}
	
	var search = new P8Search()
	
	search.objectStore = '<objectStoreID>'
	search.query = "select * from Document where DocumentTitle like '%test%'"
	search.searchRows = true
	
	client.search(search, function(err, result) {
		if (err) {
			return console.log(err)
		}
		
		for (var i = 0, len = result.rows.length; i < len; i++) {
			var doc = result.rows[i]
			
			console.log('Found', doc.DocumentTitle, 'with id', doc.Id.value)
		}
	})
})
```
