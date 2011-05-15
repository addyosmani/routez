/*
 Hash-History manager
 Based on a gist by @jashkenas
 This jQuery-agnostic version by Addy Osmani
 Includes patch for callback to correctly execute and minor fix for IE compatibility.
*/

                                                                                                                                                                             
// Handles JavaScript history management and callbacks. To use, register a
// regexp that matches the history hash with its corresponding callback
window.hashHistory = {
	
	/*padolsey's alternative to user-agent sniffing*/
	
	ie:function(){
	  var undef,
	        v = 3,
	        divr = document.createElement('div'),
	        all = divr.getElementsByTagName('i');

	    while (
	        divr.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	    return v > 4 ? v : undef;
	},


  // The interval at which the window location is polled.
  URL_CHECK_INTERVAL : 500,

  // We need to use an iFrame to save history if we're in an old version of IE.
  USE_IFRAME : (this.ie < 8),
  // The ordered list of history handlers matchers and callbacks.
  handlers : [],

  // Every URL change fires these callbacks
  callbacks: [],

  // The current recorded window.location.hash.
  hash : window.location.hash,

  // Initialize history with an empty set of handlers.
  // Bind to the HTML5 'onhashchange' callback, if it exists. Otherwise,
  // start polling the window location.
  initialize : function() {
    _.bindAll(this, 'checkURL');
    //if (this.USE_IFRAME) this.iframe = jQuery('<iframe src="javascript:0"/>').hide().appendTo('body')[0].contentWindow;
	if (this.USE_IFRAME){
		var tempiFrame  = document.createElement('iframe'),
		    tempHandler = document.getElementsByTagName('body')[0].contentWindow;
		
		tempiFrame.style.border = '0px';
		tempiFrame.style.width = '0px';
		tempiFrame.style.height = '0px';
		tempiFrame.src = "javascript:0";
		tempHandler.innerHTML += tempHandler;
		this.iframe = tempHandler;
	}
		
		//var iframeHTML = '\<iframe id="temp" src="javascript:0" style="border:0px; width:0px; height:0px;"><\/iframe>';
	    ///document.body.innerHTML += iframeHTML;
	
		//this.iframe = jQuery('<iframe src="javascript:0"/>').hide().appendTo('body')[0].contentWindow;


    if ('onhashchange' in window) {
      window.onhashchange = this.checkURL;
    } else {
      setInterval(this.checkURL, this.URL_CHECK_INTERVAL);
    }
  },

  // Register a history handler. Pass a regular expression that can be used to
  // match your URLs, and the callback to be invoked with the remainder of the
  // hash, when matched. Optionally pass a callback that will be fired on every
  // hash change. This can be used for Google Analytics AJAX calls.
  register : function(matcher, callback) {
    if (_.isFunction(callback)) {
      this.handlers.push({matcher : matcher, callback : callback});
    } else {
      this.callbacks.push(matcher);
    }
  },

  // Save a moment into browser history. Make sure you've registered a handler
  // for it. You're responsible for pre-escaping the URL fragment.
  save : function(hash) {
    var next = hash ? '#' + hash : '';
    if (this.hash == next) return;
    window.location.hash = this.hash = next;
    if (this.USE_IFRAME && (this.iframe && (this.hash != this.iframe.location.hash))) {
      this.iframe.document.open().close();
      this.iframe.location.hash = this.hash;
    }
    this.fireCallbacks(hash);
  },

  // Check the current URL hash against the recorded one, firing callbacks.
  checkURL : function() {
    var current = window.location.hash;
    if (current == this.hash && this.USE_IFRAME) {
      current = this.iframe.location.hash;
    }
    if (!current ||
        current == this.hash ||
        '#' + current == this.hash ||
        current == decodeURIComponent(this.hash)) return false;
    if (this.USE_IFRAME) {
      window.location.hash = this.iframe.location.hash = current;
    }
    this.loadURL();
  },

  // Load the history callback associated with the current page fragment. On
  // pages that support history, this method should be called at page load,
  // after all the history callbacks have been registered.
  loadURL : function(fallback) {
    var hash = this.hash = window.location.hash;
    var matched = _.any(this.handlers, function(handler) {
      if (hash.match(handler.matcher)) {
        handler.callback(hash.replace(handler.matcher, ''));
        return true;
      }
    });
    if (!matched && !hash && fallback) fallback();
    this.fireCallbacks(hash);
  },

  // Fires all callbacks after a history event is recorded
  fireCallbacks : function(hash) {

   for (var c=0, l=this.handlers.length; c < l; c++) {
      this.handlers[c].callback();
alert('fired');
    }
  }

};
