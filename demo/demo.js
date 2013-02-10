
// fx: translate

var element_translate = $('#element-translate');
var toggler_translate = $('#toggler-translate');
var fx_translate = new Fx(element_translate, 'translate3d');
var translate_call_count = 0;

addEvent(toggler_translate, 'click', function (e) {

	// alternate the direction with every click

	var to;
	
	if (++translate_call_count % 2) {

		to = element_translate.parentNode.offsetWidth - element_translate.offsetWidth;

	} else {

		to = 0;

	}

	fx_translate.to(to, 0, 0);

});

// fx: left

var element_left = $('#element-left');
var toggler_left = $('#toggler-left');
var fx_left = new Fx(element_left, 'left');
var left_call_count = 0;

addEvent(toggler_left, 'click', function (e) {

	// alternate the direction with every click

	var to;
	
	if (++left_call_count % 2) {

		to = element_left.parentNode.offsetWidth - element_left.offsetWidth;

	} else {

		to = 0;

	}

	fx_left.to(to);

});

// fx: scale

var element_scale = $('#element-scale');
var toggler_scale = $('#toggler-scale');
var fx_scale = new Fx(element_scale, 'scale3d');
var scale_call_count = 0;

addEvent(toggler_scale, 'click', function (e) {

	var to;
	
	if (++scale_call_count % 2) {

		to = 10;

	} else {

		to = 1;

	}
	
	fx_scale.to(to, to, to);

});

// fx: opacity

var element_opacity = $('#element-opacity');
var toggler_opacity = $('#toggler-opacity');
var fx_opacity = new Fx(element_opacity, 'opacity');
var opacity_call_count = 0;

addEvent(toggler_opacity, 'click', function (e) {

	var to;
	
	if (++opacity_call_count % 2) {

		to = 0;

	} else {

		to = 1;

	}
	
	fx_opacity.to(to);

});

// fx: font-size

var element_font_size = $('#element-font-size');
var toggler_font_size = $('#toggler-font-size');
var fx_font_size = new Fx(element_font_size, 'font-size');
var font_size_call_count = 0;

addEvent(toggler_font_size, 'click', function (e) {

	var to;
	
	if (++font_size_call_count % 2) {

		to = 72;

	} else {

		to = 10;

	}
	
	fx_font_size.to(to);

});