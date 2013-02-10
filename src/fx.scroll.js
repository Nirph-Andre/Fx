Fx.Scroll = (function(){

	'use strict';

	return function (element, direction) {

		var self = this;
		var isVertical = direction === 'vertical';
		var property = 'scroll' + (isVertical ? 'Top' : 'Left');
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

				var newScroll = fxTranslate.get()[isVertical ? 1 : 0];
				fxTranslate.set(0,0,0);
				fxScroll.set(-newScroll);

				//console.log('end: new=', newScroll);

			}
		});

		var set = function(x) {
			fxTranslate.set.apply(this, getMatrix(x));
		};

		var to = function(x) {
			fxTranslate.to.apply(this, getMatrix(x));
		};

		var getMatrix = function(x) {
			return isVertical ? [0, -x, 0] : [-x, 0, 0];
		};


		// public API


		self.set = set;
		self.to = to;

	};

})();