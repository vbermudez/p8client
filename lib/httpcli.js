(function() { 
	'use strict'
	
	var has_require = typeof require !== 'undefined'
	var root = this
	var prev_module = root.httpcli
	var http = root.http
	
	if( typeof http === 'undefined' ) {
		if( has_require ) {
			http = require('http')
		} else {
			http = new XMLHttpRequest()
		}
	}
	
	var httpcli = function() {
	}
	
	httpcli.noConflict = function() {
		root.httpcli = prev_module		
		
		return httpcli
	}
  
  httpcli.post = function(url, params, callback) {
    return ajax(url, params, 'POST', callback)
  }
  
  httpcli.get = function(url, params, callback) {
    return ajax(url, params, 'GET', callback)
  }
  
  function parse_queryString(url, params, method) {
    var is_post = method == 'POST'
    var parsed_url = parse_url(url)
    var queryString = typeof params !== 'undefined' ? jsonToQueryString(params) : ''
    
    if (!is_post) {
      if (parsed_url.search && parsed_url.search != '') {
        if (queryString && queryString != '') {
          queryString = parsed_url.search + '&' + queryString 
        } else {
          queryString = parsed_url.search
        }
      } else {
        if (queryString && queryString != '') {
          queryString = '?' + queryString 
        }
      }
    }
    
    return queryString
  }
	
  function ajax(url, params, method, callback) {
    if (has_require) {
      return ajax_node(url, params, method, callback)
    }
    
    var is_post = method == 'POST'
    var queryString = parse_queryString(url, params, method)
    var xhr = new XMLHttpRequest()
     
    xhr.open(method, url, true)
    
    if (is_post) {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    }
    
    xhr.onload = function(evt) {
      var json = {}
      
      try {
        json = JSON.parse(evt.target.responseText)
      } catch (e) { }
      
      callback.call(xhr, null, json || evt.target.responseText)
    }
    
    xhr.onerror = function(evt) {
      callback.call(xhr, evt)
    }
    
    xhr.onreadystatechange = function(evt) {
      if (evt.target.readyState == 4) {
        switch (evt.target.status) {
          case 200:
            xhr.onload(evt)
            
            break
            
          default:
            xhr.onerror(evt.target.statusText)
            
            break
        }
      }
    }
    
    return xhr.send(is_post ? queryString : null)
  }
  
  function ajax_node(url, params, method, callback) {
    var is_post = method == 'POST'
    var parsed_url = parse_url(url)
    var queryString = parse_queryString(url, params, method)
    
    var opts = {
      host: parsed_url.hostname,
      port: parsed_url.port || 80,
      path: parsed_url.pathname + ( !is_post ? queryString : '' ),
      method: method,
      agent: false,
      timeout: 120 * 1000
    }
    
    if (is_post) {
      opts['headers'] = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    
    var req = http.request(opts, function(res) {
      var body = []
  
      res.on('data', function(data) {
        body.push(data)
      });
  
      res.on('end', function() {
        var result = ''
        var json = {}
        
        if (body.length > 0) {
          result = body.join('')
        }
        
        try {
          json = JSON.parse(result)
        } catch (e) { }
        
        callback.call(this, null, json || result)
      });
  
      res.on('error', function(err) {
        callback.call(this, err)
      });
    });
  
    req.on('socket', function(socket) {
      socket.setTimeout(120 * 1000)
  
      socket.on('timeout', function() {
          console.log('req timeout')
          req.abort();
      });
    });
  
    req.on('error', function(err) {
      callback.call(this, err)
    });
    
    if (is_post) {
      req.write( queryString )
    }
    
    return req.end();
  }
  
  function parse_url(url) {
    var match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/)
    
    return match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  }
  
  function jsonToQueryString(json) {
    var result = '';
  
    for (var key in json) {
      if (result != '') {
        result += '&';
      }
  
      result += key + '=' + json[key];
    }
  
    return result;
  }
  
	if( typeof exports !== 'undefined' ) {
		if( typeof module !== 'undefined' && module.exports ) {
			exports = module.exports = httpcli
		}
		
		exports.httpcli = httpcli
	} else {
		root.httpcli = httpcli
	}
}).call(this)
