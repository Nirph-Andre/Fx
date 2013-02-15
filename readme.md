#Fx.js

A super lightweight, high performance, cross-browser, dependency-free animation library for the modern web.

##Features:

- **Super lightweight**: Just 3kb minified
- **High performance**: Uses requestAnimationFrame and hardware-accelerated CSS transforms, degrades gracefully in older browsers
- **Cross browser**: Tested in Chrome, Safari, Firefox, Opera, iOS, Android, and IE6+
- **Dependency-free**: No jQuery, no MooTools, no YUI, no Closure
- **Supports module loaders**: CommonJS and AMD

##Usage

```javascript

var fx = new Fx(DOMElement, property, options);

fx.get();		// get current value of the property
fx.set(value);	// immediately set value
fx.to(value);	// animate to value
```

##Example

```javascript

var element = document.getElementById('myElement');
var fx = new Fx(element, 'top', {
	duration: 1000
}).to(100);
```

##API

- `Fx.element` {DOMElement} Returns the element attached to the Fx instance
- `Fx.property` {String} Returns the property attached to the Fx instance
- `Fx.get()` {Function} Returns the current value of the property attached to the Fx instance
- `Fx.set(value)` {Function} Set the Fx instance's value immediately (without animating it)
- `Fx.to(value)` {Function} Animate the Fx instance to the given value

##Options

- `duration` {Number} The animation duration (in milliseconds)
- `animationStart` {Function} Animation start hook
- `animationEnd` {Function} Animation end hook
- `transition` {Function} Custom relative transition function
- `unit` {String} Units (`px`, `%`, `em`, `deg`, etc...)

##Supported properties

 `bottom` `height` `left` `margin` `margin-bottom` `margin-left` `margin-right` `margin-top` `opacity` `padding` `padding-bottom` `padding-left` `padding-right` `padding-top` `right` `scale` `scale3d` `top` `translate` `translate3d` `width` `zoom`

###Fx.Color

`background-color` `border-bottom-color` `border-color` `border-left-color` `border-right-color` `border-top-color` `color`

###Fx.Scroll

`scrollLeft` `scrollTop`

##To do:

- Unit tests
- Support for transitioning multiple properties
- Support for CSS class transitions
- Support for colors