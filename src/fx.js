var Fx = (function(){

	'use strict';

	var win = window;
	var appVersion = navigator.appVersion;
	var isIE = appVersion.search('MSIE') > -1;
	var is_IE9_and_below = isIE && parseInt(appVersion.slice(22,26),10) < 10;
	var vendors = 'Ms Moz Webkit O'.split(' ');
	var vendor_count = vendors.length;
	var win_perf = win.performance;
	var hasPerformance = !!(win_perf && win_perf.now);
	var AF = 'AnimationFrame', cAF = 'cancel'+AF, CAF = 'Cancel'+AF, rAF = 'request'+AF, RAF = 'Request'+AF;


	//
	// Polyfills
	//


	// requestAnimationFrame polyfill
	// based on paulirish.com/2011/requestanimationframe-for-smart-animating
	(function() {
		var lastTime = 0;
		
		if (!win[rAF]) {

			for (var x = 0; x < vendor_count; x++) {
				var vnd = vendors[x];
				var prefix = vnd.toLowerCase();
				var prefixedRAF = win[prefix+RAF];
				if (prefixedRAF) {
					win[rAF] = prefixedRAF;
					win[cAF] = win[prefix+CAF] || win[prefix+'CancelRequest'+AF];
					break;
				}
			}
		 
			if (!win[rAF]) {
				win[rAF] = function (callback) {
					var currTime = +new Date();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = setTimeout(function(){ callback(currTime+timeToCall) },timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
				win[cAF] = clearTimeout;
			}

		}

	}());

	// CSS3 transform polyfill
	var vendorTransform = (function() {
		var style = document.createElement('span').style;
		var Transform = 'Transform';
		if (style.transform) return 'transform';
		for (var v = vendor_count; v--;) {

			var vendor = vendors[v];
			var propL = vendor.toLowerCase()+Transform;
			var propU = vendor+Transform;

			if (isDefined(style[propL])) {

				return propL;

			} if (isDefined(style[propU])) {

				return propU;

			}

		}
	})();


	//
	// Fx
	//


	var Fx = function (element, property, options) {


		// fix for IE


		if (is_IE9_and_below && property === 'translate3d') {

			property = 'translate';

		}


		// vars


		var self = this;
		var style = element.style;
		var px = 'px';

		var x, y, z;
		var animationFrame;
		var time_start, time_end;
		var x_exists, y_exists, z_exists,
			x_from,   y_from,	z_from,
			x_to,	  y_to,		z_to,
			x_dir,
			mx,		  my,		mz;


		// set user options
		

		self.options = {
			duration: 300,
			animationStart: function(){},
			animationEnd: function(){}
		};

		if (options) {
			setOptions(self.options, options);
		}


		// define tween functions

		var tweenNoCSS3 = function (x, y) {
			style.left = Math.round(x) + px;
			style.top = Math.round(y) + px;
		};

		var setters = {
			translate3d: vendorTransform ? function (x, y, z) {
				var _x = x ? x + px : 0;
				var _y = y ? y + px : 0;
				var _z = z ? z + px : 0;
				style[vendorTransform] = property + '(' + [_x, _y, _z].join(',') + ')';
			} : tweenNoCSS3,
			translate: vendorTransform ? function (x, y) {
				var _x = x ? x + px : 0;
				var _y = y ? y + px : 0;
				style[vendorTransform] = property + '(' + [_x, _y].join(',') + ')';
			} : tweenNoCSS3,
			scale3d: vendorTransform ? function () {
				style[vendorTransform] = property + '(' + arguments.join(',') + ')';
			} : function(){},
			bottom: function(x) {
				style[property] = x + px;
			},
			opacity: function(x) {
				style[property] = x;
			},
			scrollLeft: function(x) {
				element[property] = x;
			}
		};

		setters.scale = setters.scale3d;
		setters['font-size'] = setters.height = setters.width = setters.left = setters.right = setters.top = setters.bottom;
		setters.zoom = setters.opacity;
		setters.scrollTop = setters.scrollLeft;

		var set = setters[property];

		// get initial property values

		var get = function() {

			var result = [0,0,0];
			var sliceStart;

			switch (property) {
				case 'translate':

					sliceStart = 10;

				case 'translate3d':

					if (vendorTransform) {

						if (!sliceStart) {
							sliceStart = 12;
						}

						var currentStyle = style[vendorTransform];
						var matches = currentStyle.slice(sliceStart, -1).split(',');

						if (currentStyle) {

							if (matches[0]) {

								result[0] = parse(matches[0]);

							} if (matches[1]) {

								result[1] = parse(matches[1]);

							} if (matches[2]) {

								result[2] = parse(matches[2]);

							}

						}

					} else {

						result[0] = parse(style.left) || 0;
						result[1] = parse(style.top) || 0;

					}

					break;

				case 'bottom':
				case 'font-size':
				case 'height':
				case 'left':
				case 'right':
				case 'top':
				case 'width':

					result[0] = parse(style[property]) || 0;

					break;

				case 'opacity':
				case 'zoom':

					var value = parse(style[property]);
					result[0] = isNaN(value) ? 1 : value; // because 0 is falsey

					break;

				case 'scrollLeft':
				case 'scrollTop':

					result[0] = element[property] || 0;
			}

			return result;

		};

		// animate!

		var compute = function (time){

			var t = time - time_start;

			if (x_exists) {

				x = mx*t + x_from;

			} if (y_exists) {

				y = my*t + y_from;

			} if (z_exists) {

				z = mz*t + z_from;

			}

			set(x, y, z);
		};

		var tick = function (time) {

			compute(time);

			if (time < time_end) {
				win[rAF](tick);
			}
			else {
				win[cAF](animationFrame);
				set(x_to, y_to, z_to);
				self.options.animationEnd();
			}
		};

		var to = function (new_x, new_y, new_z) {

			var duration = self.options.duration;

			x_exists = isNumber(new_x);
			y_exists = isNumber(new_y);
			z_exists = isNumber(new_z);

			self.options.animationStart();

			// get current state
			var state = get();

			x = state[0];
			y = state[1];
			z = state[2];

			// pre-compute as much as possible
			if (x_exists) {

				x_from = x;
				x_to = new_x;
				x_dir = x_from > x_to ? -1 : 1;
				mx = (x_to - x_from)/duration;

			} if (y_exists) {

				y_from = y;
				y_to = new_y;
				my = (y_to - y_from)/duration;

			} if (z_exists) {

				z_from = z;
				z_to = new_z;
				mz = (z_to - z_from)/duration;

			}

			// firefox supports window.performance, but for some reason
			// passes low-resolution timestamps to requestAnimationFrame callbacks;
			// instead, firefox provides the proprietary window.mozAnimationStartTime
			
			time_start = win.mozAnimationStartTime || (hasPerformance ? win_perf.now() : +new Date());
			time_end = time_start + duration;

			animationFrame = win[rAF](tick);

		};


		// public API


		self.element = element;
		self.property = property;
		self.get = get;
		self.set = set;
		self.to = to;

		return self;

	};

	Fx.Scroll = function(element, options) {

		var self = this;

		self.options = {
			direction: 'vertical'
		};

		if (options) {
			setOptions(self.options, options);
		}

		var dir = self.options.direction;
		var property = 'scroll' + (dir === 'vertical' ? 'Top' : 'Left');
		var oldScroll = 0;

		var fxScroll = new Fx(element.parentNode, property);
		var fxTranslate = new Fx(element, 'translate3d', {
			animationStart: function() {

				oldScroll = fxScroll.get()[0];
				fxTranslate.set.apply(fxTranslate, getMatrix(oldScroll));
				fxScroll.set(0);

				//console.log('start: old=', oldScroll, ', matrix=', getMatrix(oldScroll));

			},
			animationEnd: function() {

				var newScroll = fxTranslate.get()[dir === 'vertical' ? 1 : 0];
				fxTranslate.set(0,0,0);
				fxScroll.set(-newScroll);

				//console.log('end: new=', newScroll);

			},
			duration: options ? options.duration : null
		});

		var set = function(x) {
			fxTranslate.set.apply(this, getMatrix(x));
		};

		var to = function(x) {
			fxTranslate.to.apply(this, getMatrix(x));
		};

		var getMatrix = function(x) {
			return dir === 'vertical' ? [0, -x, 0] : [-x, 0, 0];
		};


		// public API


		self.set = set;
		self.to = to;

	};


	//
	// helpers
	//
	

	function isDefined (something) {
		return typeof something !== 'undefined';
	}

	function isNumber (something) {
		return typeof something === 'number';
	}

	function parse (string) {
		return parseInt(string, 10);
	}

	function setOptions (options, userOptions) {

		for (var option in userOptions) {
			var opt = userOptions[option];
			if (opt && options.hasOwnProperty(option)) {
				options[option] = opt;
			}
		}

	}


	return Fx;

})();