(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.animate = animate;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var easing = easeOutQuart;

function easeOutQuart(t, b, c, d) {
	t /= d;
	t--;
	return -c * (t * t * t * t - 1) + b;
};

var Shape = function () {
	function Shape() {
		_classCallCheck(this, Shape);

		this.ctx = null;
	}

	_createClass(Shape, [{
		key: 'setContext',
		value: function setContext(ctx) {
			this.ctx = ctx;
		}
	}]);

	return Shape;
}();

var Line = exports.Line = function (_Shape) {
	_inherits(Line, _Shape);

	function Line(start, end, color, lineWidth, timer, duration) {
		_classCallCheck(this, Line);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this));

		_this.start = start;
		_this.end = end;
		_this.color = color;
		_this.lineWidth = lineWidth;
		_this.timer = timer;
		_this.duration = duration;
		return _this;
	}

	_createClass(Line, [{
		key: 'draw',
		value: function draw(time) {
			if (time >= this.timer) {
				var ctx = this.ctx;
				var t = time - this.timer;
				if (t > this.duration) {
					t = this.duration;
				}
				ctx.beginPath();
				ctx.strokeStyle = this.color;
				ctx.lineWidth = this.lineWidth;
				var endX = easing(t, this.start[0], this.end[0] - this.start[0], this.duration),
				    endY = easing(t, this.start[1], this.end[1] - this.start[1], this.duration);

				ctx.moveTo(this.start[0], this.start[1]);
				ctx.lineTo(endX, endY);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}, {
		key: 'drawBack',
		value: function drawBack(time) {
			if (time <= this.duration) {
				var ctx = this.ctx;
				ctx.beginPath();
				ctx.strokeStyle = this.color;

				var startX = easing(time, this.start[0], this.end[0] - this.start[0], this.duration),
				    startY = easing(time, this.start[1], this.end[1] - this.start[1], this.duration);
				ctx.moveTo(startX, startY);
				ctx.lineTo(this.end[0], this.end[1]);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}]);

	return Line;
}(Shape);

var Arc = exports.Arc = function (_Shape2) {
	_inherits(Arc, _Shape2);

	function Arc(center, radius, start, length, color, lineWidth, timer, duration) {
		_classCallCheck(this, Arc);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Arc).call(this));

		_this2.center = center;
		_this2.radius = radius;
		_this2.start = start;
		_this2.length = length;
		_this2.color = color;
		_this2.lineWidth = lineWidth;
		_this2.timer = timer;
		_this2.anticlockwise = false;
		_this2.fill = false;
		_this2.duration = duration;
		return _this2;
	}

	_createClass(Arc, [{
		key: 'draw',
		value: function draw(time) {
			if (time >= this.timer) {
				var ctx = this.ctx;
				var t = time - this.timer;
				if (t > this.duration) {
					t = this.duration;
				}

				var angle = easing(t, 0, this.length, this.duration),
				    endPath = this.start + angle;

				ctx.beginPath();
				ctx.lineWidth = this.lineWidth;

				if (this.fill) {
					var x = this.center[0] + this.radius * Math.cos(this.start),
					    y = this.center[1] + this.radius * Math.sin(this.start);
					ctx.moveTo(this.center[0], this.center[1]);
					ctx.lineTo(x, y);
					ctx.arc(this.center[0], this.center[1], this.radius, this.start, endPath, this.anticlockwise);
					ctx.lineTo(this.center[0], this.center[1]);
					ctx.fillStyle = this.color;
					ctx.fill();
				} else {
					ctx.arc(this.center[0], this.center[1], this.radius, this.start, endPath, this.anticlockwise);
					ctx.strokeStyle = this.color;
					ctx.stroke();
				}
				ctx.closePath();
			}
		}
	}, {
		key: 'drawBack',
		value: function drawBack(time) {
			if (time <= this.duration) {
				var ctx = this.ctx;
				var angle = easing(time, 0, this.length, this.duration);
				var startPath = this.start + angle;

				ctx.beginPath();
				if (this.fill) {
					var x = this.center[0] + this.radius * Math.cos(startPath),
					    y = this.center[1] + this.radius * Math.sin(startPath);
					ctx.moveTo(this.center[0], this.center[1]);
					ctx.lineTo(x, y);
					ctx.arc(this.center[0], this.center[1], this.radius, startPath, this.start + this.length, this.anticlockwise);
					ctx.lineTo(this.center[0], this.center[1]);
					ctx.fillStyle = this.color;
					ctx.fill();
				} else {
					ctx.arc(this.center[0], this.center[1], this.radius, startPath, this.start + this.length, this.anticlockwise);
					ctx.strokeStyle = this.color;
					ctx.stroke();
				}
				ctx.closePath();
			}
		}
	}]);

	return Arc;
}(Shape);

// quadratic bezier: percent is 0-1


function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
	var x = Math.pow(1 - percent, 2) * startPt[0] + 2 * (1 - percent) * percent * controlPt[0] + Math.pow(percent, 2) * endPt[0];
	var y = Math.pow(1 - percent, 2) * startPt[1] + 2 * (1 - percent) * percent * controlPt[1] + Math.pow(percent, 2) * endPt[1];
	return [x, y];
}

var CurveQuad = exports.CurveQuad = function (_Shape3) {
	_inherits(CurveQuad, _Shape3);

	function CurveQuad(start, end, control, color, lineWidth, timer, duration) {
		_classCallCheck(this, CurveQuad);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(CurveQuad).call(this));

		_this3.start = start;
		_this3.end = end;
		_this3.control = control;

		_this3.color = color;
		_this3.lineWidth = lineWidth;
		_this3.timer = timer;

		_this3.duration = duration;
		return _this3;
	}

	_createClass(CurveQuad, [{
		key: 'draw',
		value: function draw(time) {
			if (time >= this.timer) {
				var ctx = this.ctx;
				var t = time - this.timer;
				if (t > this.duration) {
					t = this.duration;
				}

				var perc = t / this.duration,
				    endPt = getQuadraticBezierXYatPercent(this.start, this.control, this.end, perc),
				    controlPt = [this.start[0] + ~ ~((this.control[0] - this.start[0]) * perc), this.start[1] + ~ ~((this.control[1] - this.start[1]) * perc)];

				ctx.beginPath();
				ctx.lineWidth = this.lineWidth;
				ctx.strokeStyle = this.color;
				ctx.beginPath();
				ctx.moveTo(this.start[0], this.start[1]);
				ctx.quadraticCurveTo(controlPt[0], controlPt[1], endPt[0], endPt[1]);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}, {
		key: 'drawBack',
		value: function drawBack(time) {
			if (time <= this.duration) {
				var ctx = this.ctx;

				var perc = time / this.duration,
				    startPt = getQuadraticBezierXYatPercent(this.start, this.control, this.end, perc),
				    controlPt = [this.end[0] + ~ ~((this.control[0] - this.end[0]) * perc), this.end[1] + ~ ~((this.control[1] - this.end[1]) * perc)];

				ctx.beginPath();
				ctx.lineWidth = this.lineWidth;
				ctx.strokeStyle = this.color;
				ctx.beginPath();
				ctx.moveTo(startPt[0], startPt[1]);
				ctx.quadraticCurveTo(controlPt[0], controlPt[1], this.end[0], this.end[1]);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}]);

	return CurveQuad;
}(Shape);

var Clear = function (_Shape4) {
	_inherits(Clear, _Shape4);

	function Clear() {
		_classCallCheck(this, Clear);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Clear).call(this));
	}

	_createClass(Clear, [{
		key: 'draw',
		value: function draw() {}
	}, {
		key: 'drawBack',
		value: function drawBack(time) {
			this.draw(this.time);
		}
	}]);

	return Clear;
}(Shape);

var ClearRect = exports.ClearRect = function (_Clear) {
	_inherits(ClearRect, _Clear);

	function ClearRect(x, y, width, height, time) {
		_classCallCheck(this, ClearRect);

		var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClearRect).call(this));

		_this5.x = x;
		_this5.y = y;
		_this5.width = width;
		_this5.height = height;

		_this5.time = time;
		return _this5;
	}

	_createClass(ClearRect, [{
		key: 'draw',
		value: function draw(t) {
			if (t >= this.time) {
				var ctx = this.ctx;
				ctx.clearRect(this.x, this.y, this.width, this.height);
			}
		}
	}]);

	return ClearRect;
}(Clear);

var ClearQuad = exports.ClearQuad = function (_Clear2) {
	_inherits(ClearQuad, _Clear2);

	function ClearQuad(x, y, x2, y2, height, time) {
		_classCallCheck(this, ClearQuad);

		var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClearQuad).call(this));

		_this6.x = x;
		_this6.y = y;
		_this6.x2 = x2;
		_this6.y2 = y2;
		_this6.height = height;
		_this6.time = time;
		return _this6;
	}

	_createClass(ClearQuad, [{
		key: 'draw',
		value: function draw(t) {
			if (t >= this.time) {
				var ctx = this.ctx;

				ctx.save();
				ctx.globalCompositeOperation = 'destination-out';
				//ctx.strokeStyle = '#000';

				ctx.beginPath();
				ctx.lineWidth = this.height;
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x2, this.y2);
				ctx.stroke();

				ctx.restore();
			}
		}
	}]);

	return ClearQuad;
}(Clear);

var ClearArc = exports.ClearArc = function (_Clear3) {
	_inherits(ClearArc, _Clear3);

	function ClearArc(center, radius, time) {
		_classCallCheck(this, ClearArc);

		var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClearArc).call(this));

		_this7.center = center;
		_this7.radius = radius;
		_this7.time = time;
		return _this7;
	}

	_createClass(ClearArc, [{
		key: 'draw',
		value: function draw(t) {
			if (t >= this.time) {
				var ctx = this.ctx,
				    x = this.center[0],
				    y = this.center[1],
				    radius = this.radius;

				ctx.save();
				ctx.globalCompositeOperation = 'destination-out';
				//ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.restore();
			}
		}
	}]);

	return ClearArc;
}(Clear);

var Part = exports.Part = function () {
	function Part(width, height) {
		var debug = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		_classCallCheck(this, Part);

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');

		this.delay = 0;
		this.delayBack = 0;

		this.shapes = [];

		if (debug) document.body.appendChild(this.canvas);
	}

	_createClass(Part, [{
		key: 'draw',
		value: function draw(t) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.shapes.forEach(function (shape) {
				shape.draw(t);
			});
		}
	}, {
		key: 'drawBack',
		value: function drawBack(t) {
			var _this8 = this;

			if (t > this.delayBack) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

				this.shapes.forEach(function (shape) {
					shape.drawBack(t - _this8.delayBack);
				});
			}
		}
	}, {
		key: 'add',
		value: function add(shape) {
			shape.setContext(this.ctx);
			this.shapes.push(shape);
		}
	}, {
		key: 'ended',
		value: function ended(t) {
			var finish = true;
			this.shapes.forEach(function (shape) {
				if (shape.duration) {
					finish = finish && t >= shape.timer + shape.duration;
				}
			});

			return finish;
		}
	}, {
		key: 'endedBack',
		value: function endedBack(t) {
			var delay = this.delayBack;
			var finish = true;
			this.shapes.forEach(function (shape) {
				if (shape.duration) {
					finish = finish && t >= shape.duration + delay;
				}
			});

			return finish;
		}
	}]);

	return Part;
}();

function animate(canvas, parts) {
	var ctx = canvas.getContext('2d'),
	    width = canvas.width,
	    height = canvas.height;

	var reqStart = null;
	function forward() {
		var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		time = ~ ~time;
		if (reqStart === null) {
			reqStart = time;
		}

		var progress = time - reqStart,
		    ended = true;

		ctx.clearRect(0, 0, width, height);
		parts.forEach(function (part) {
			part.draw(progress);
			ctx.drawImage(part.canvas, 0, 0);
			ended = ended && part.ended(progress);
		});

		if (!ended) {
			requestAnimationFrame(forward);
		} else {
			reqStart = null;
			setTimeout(function () {
				return requestAnimationFrame(backward);
			}, 1000);
		}
	}

	function backward(time) {
		var finish = true;
		time = ~ ~time;
		if (reqStart === null) {
			reqStart = time;
		}

		var progress = time - reqStart;
		ctx.clearRect(0, 0, width, height);

		parts.forEach(function (part) {
			part.drawBack(progress);
			ctx.drawImage(part.canvas, 0, 0);
			finish = finish && part.endedBack(progress);
		});

		if (!finish) {
			requestAnimationFrame(backward);
		} else {
			setTimeout(begin, 1500);
		}
	}

	function begin() {
		reqStart = null;
		requestAnimationFrame(forward);
	}

	begin();
}

},{}],2:[function(require,module,exports){
'use strict';

var _base = require('../base.js');

var canvas = document.querySelector('canvas'),
    width = canvas.width,
    height = canvas.height,
    lineWidth = 4,
    duration = 300,
    eyeColor = '#ffdc3d',
    irisColor = '#a6ceff';

(0, _base.animate)(canvas, populate());

function populate() {
	var parts = [];

	var x = width / 2,
	    y = height / 2,
	    startTime = 0;

	// eye
	var part = new _base.Part(width, height);
	for (var i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration / 4;
		arc = new _base.Arc([x, y], 135 - i * lineWidth * 2, -Math.PI / 2, -2 * Math.PI, eyeColor, lineWidth, startTime, duration);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);
	startTime = startTime + duration;

	part = new _base.Part(width, height);
	for (var _i = 0, _arc = null; _i < 4; _i++) {
		startTime = startTime + duration / 2;
		part.add(new _base.CurveQuad([x - 99 - _i * lineWidth * 1.05, y - 50 + _i * 1.5 * lineWidth * 2.7], [x + 99 + _i * lineWidth * 1.05, y - 50 + _i * 1.5 * lineWidth * 2.7], [x, y - 120 + lineWidth * 0.5], eyeColor, lineWidth, startTime, duration / 4));
	}
	parts.push(part);
	startTime = startTime + duration;

	part = new _base.Part(width, height);
	for (var _i2 = 0, _arc2 = null; _i2 < 4; _i2++) {
		startTime = startTime + duration / 2;
		part.add(new _base.CurveQuad([x + 99 + _i2 * lineWidth * 1.05, y + 50 - _i2 * 1.5 * lineWidth * 2.7], [x - 99 - _i2 * lineWidth * 1.05, y + 50 - _i2 * 1.5 * lineWidth * 2.7], [x, y + 120 - lineWidth * 0.5], eyeColor, lineWidth, startTime, duration / 4));
	}
	parts.push(part);
	startTime = startTime + duration;

	// iris
	part = new _base.Part(width, height);
	for (var _i3 = 0, _arc3 = null; _i3 < 4; _i3++) {
		startTime = startTime + duration / 4;
		_arc3 = new _base.Arc([x, y], 50 - _i3 * lineWidth * 2, -Math.PI / 2, 2 * Math.PI, irisColor, lineWidth, startTime, duration);
		part.add(_arc3);
	}

	parts.push(part);

	return parts;
}

},{"../base.js":1}]},{},[2]);
