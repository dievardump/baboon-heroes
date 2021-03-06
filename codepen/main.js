(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Line = function (_Shape) {
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

var Arc = function (_Shape2) {
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

var CurveQuad = function (_Shape3) {
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

var ClearRect = function (_Clear) {
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

var ClearQuad = function (_Clear2) {
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

var ClearArc = function (_Clear3) {
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

var Part = function () {
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

var animate = function () {
	function animate(canvas) {
		_classCallCheck(this, animate);

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.stopped = true;
		this.reqStart = null;
		this.parts = [];
		this.reqId = null;
	}

	_createClass(animate, [{
		key: 'load',
		value: function load(parts) {
			this.parts = parts;
			this.stopped = false;
			this.animate();
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.stopped = true;
			cancelAnimationFrame(this.reqId);
		}
	}, {
		key: 'animate',
		value: function animate() {
			this.reqStart = null;
			this.reqId = requestAnimationFrame(this.forward.bind(this));
		}
	}, {
		key: 'forward',
		value: function forward() {
			var _this9 = this;

			var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			if (!this.stopped) {
				(function () {
					var parts = _this9.parts,
					    ctx = _this9.ctx;

					time = ~ ~time;
					if (_this9.reqStart === null) {
						_this9.reqStart = time;
					}

					var progress = time - _this9.reqStart,
					    ended = true;

					ctx.clearRect(0, 0, _this9.width, _this9.height);
					parts.forEach(function (part) {
						part.draw(progress);
						ctx.drawImage(part.canvas, 0, 0);
						ended = ended && part.ended(progress);
					});

					if (!ended) {
						_this9.reqId = requestAnimationFrame(_this9.forward.bind(_this9));
					} else {
						_this9.reqStart = null;
						setTimeout(function () {
							return _this9.reqId = requestAnimationFrame(_this9.backward.bind(_this9));
						}, 1000);
					}
				})();
			}
		}
	}, {
		key: 'backward',
		value: function backward(time) {
			var _this10 = this;

			if (!this.stopped) {
				(function () {
					var parts = _this10.parts,
					    ctx = _this10.ctx;

					var finish = true;
					time = ~ ~time;
					if (_this10.reqStart === null) {
						_this10.reqStart = time;
					}

					var progress = time - _this10.reqStart;
					ctx.clearRect(0, 0, _this10.width, _this10.height);

					parts.forEach(function (part) {
						part.drawBack(progress);
						ctx.drawImage(part.canvas, 0, 0);
						finish = finish && part.endedBack(progress);
					});

					if (!finish) {
						_this10.reqId = requestAnimationFrame(_this10.backward.bind(_this10));
					} else {
						setTimeout(_this10.animate.bind(_this10), 1500);
					}
				})();
			}
		}
	}]);

	return animate;
}();

var links = Array.from(document.querySelectorAll('a[data-anim]')),
    canvas = document.querySelector('canvas'),
    animations = {};

var anim = null;

links.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		launch(link);
	}, false);
});

function launch(link) {
	var fnName = link.getAttribute('data-anim');
	if (fnName && typeof animations[fnName] === 'function') {
		canvas.setAttribute('data-anim', fnName);
		if (anim) {
			anim.stop();
		}

		anim = new animate(canvas);
		anim.load(animations[fnName](canvas));
	}
}

animations.aquaman = function aquaman(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    duration = 300,
	    color = '#fcb02d';

	var x = width / 2,
	    y = height / 2 - 130,
	    endX = x - 105,
	    endY = y + 170,
	    startTime = 0;

	// left side
	var part = new Part(width, height);
	for (var i = 0; i < 4; i++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x + 2, y + 1 + i * lineWidth * 3.5], [endX + i * lineWidth * 1.3, endY + i * lineWidth * 1.5], color, lineWidth, startTime, duration));
	}
	part.add(new ClearRect(x, y, x + lineWidth, y + lineWidth * 3 * 5, startTime - duration));
	part.add(new ClearQuad(endX - 1, endY - lineWidth, endX + lineWidth * 6, endY + lineWidth * 2.5, lineWidth * 6, startTime - duration));

	parts.push(part);

	startTime = startTime + duration / 4;

	// right side
	part = new Part(width, height);
	endX = x + 105;
	for (var _i = 0; _i < 4; _i++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x - 2, y + 1 + _i * lineWidth * 3.5], [endX - _i * lineWidth * 1.3, endY + _i * lineWidth * 1.5], color, lineWidth, startTime, duration));
	}
	part.add(new ClearRect(x - lineWidth, y, lineWidth, y + lineWidth * 3 * 5, startTime - duration));
	part.add(new ClearQuad(endX + 1, endY - lineWidth, endX - lineWidth * 6, endY + lineWidth * 2.5, lineWidth * 6, startTime - duration));

	parts.push(part);

	startTime = startTime + duration;

	// down side
	part = new Part(width, height);
	y = height / 2;

	for (var _i2 = 0; _i2 < 4; _i2++) {
		part.add(new Line([x - 100 - _i2 * lineWidth * 1, y + 28 + _i2 * lineWidth * 1.5], [x - 40, y + 28 + _i2 * lineWidth * 2 + 8 * lineWidth], color, lineWidth, startTime + (4 - _i2) * duration / 4, duration));

		part.add(new Line([x + 100 + _i2 * lineWidth * 1, y + 28 + _i2 * lineWidth * 1.5], [x + 40, y + 28 + _i2 * lineWidth * 2 + 8 * lineWidth], color, lineWidth, startTime + (4 - _i2) * duration / 4, duration));
	}

	part.add(new ClearArc([width / 2, height / 2 + 81], 45, startTime));

	parts.push(part);

	startTime = startTime + duration + duration / 4;

	// circles middle
	part = new Part(width, height);
	y = height / 2;
	for (var _i3 = 0; _i3 < 4; _i3++) {
		startTime = startTime + duration / 4;
		part.add(new Arc([width / 2, height / 2 + 81], 47 + _i3 * lineWidth * 2, Math.PI + Math.PI / 6, 2 * Math.PI / 3, color, lineWidth, startTime, duration));
	}

	parts.push(part);
	return parts;
};

animations.green = function green(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    duration = 300,
	    color = '#359a22';

	var x = width / 2,
	    y = height / 2,
	    startTime = 0;

	// head
	var part = new Part(width, height),
	    arc = new Arc([x, y], 145, -Math.PI / 2, -2 * Math.PI, '#fff', lineWidth, startTime, duration);
	arc.anticlockwise = true;
	arc.fill = true;
	part.add(arc);
	parts.push(part);
	part.delayBack = duration;
	startTime = startTime + duration;

	// top
	part = new Part(width, height);
	for (var i = 0, _arc = null; i < 4; i++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x - 77, y - 77 + i * lineWidth * 2], [x + 77, y - 77 + i * lineWidth * 2], color, lineWidth, startTime, duration));
	}

	parts.push(part);
	startTime = startTime + duration / 4;

	// bottom
	part = new Part(width, height);
	for (var _i4 = 0, _arc2 = null; _i4 < 4; _i4++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x + 77, y + 77 - _i4 * lineWidth * 2], [x - 77, y + 77 - _i4 * lineWidth * 2], color, lineWidth, startTime, duration));
	}

	parts.push(part);
	startTime = startTime + duration / 4;

	// center
	part = new Part(width, height);
	for (var _i5 = 0, _arc3 = null; _i5 < 4; _i5++) {
		startTime = startTime + duration / 4;
		_arc3 = new Arc([x, y], 77 - _i5 * lineWidth * 2, -Math.PI / 2, -2 * Math.PI, color, lineWidth, startTime, duration);
		_arc3.anticlockwise = true;
		part.add(_arc3);
	}

	part.add(new ClearRect(x - 77, y - 80, 145, 27, startTime - duration));
	part.add(new ClearRect(x - 77, y + 53, 145, 27, startTime - duration));

	parts.push(part);

	return parts;
};

animations.strange = function strange(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    duration = 300,
	    eyeColor = '#ffdc3d',
	    irisColor = '#a6ceff';

	var x = width / 2,
	    y = height / 2,
	    startTime = 0;

	// eye
	var part = new Part(width, height);
	for (var i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration / 4;
		arc = new Arc([x, y], 135 - i * lineWidth * 2, -Math.PI / 2, -2 * Math.PI, eyeColor, lineWidth, startTime, duration);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);
	startTime = startTime + duration;

	part = new Part(width, height);
	for (var _i6 = 0, _arc4 = null; _i6 < 4; _i6++) {
		startTime = startTime + duration / 2;
		part.add(new CurveQuad([x - 99 - _i6 * lineWidth * 1.05, y - 50 + _i6 * 1.5 * lineWidth * 2.7], [x + 99 + _i6 * lineWidth * 1.05, y - 50 + _i6 * 1.5 * lineWidth * 2.7], [x, y - 120 + lineWidth * 0.5], eyeColor, lineWidth, startTime, duration / 4));
	}
	parts.push(part);
	startTime = startTime + duration;

	part = new Part(width, height);
	for (var _i7 = 0, _arc5 = null; _i7 < 4; _i7++) {
		startTime = startTime + duration / 2;
		part.add(new CurveQuad([x + 99 + _i7 * lineWidth * 1.05, y + 50 - _i7 * 1.5 * lineWidth * 2.7], [x - 99 - _i7 * lineWidth * 1.05, y + 50 - _i7 * 1.5 * lineWidth * 2.7], [x, y + 120 - lineWidth * 0.5], eyeColor, lineWidth, startTime, duration / 4));
	}
	parts.push(part);
	startTime = startTime + duration;

	// iris
	part = new Part(width, height);
	for (var _i8 = 0, _arc6 = null; _i8 < 4; _i8++) {
		startTime = startTime + duration / 4;
		_arc6 = new Arc([x, y], 50 - _i8 * lineWidth * 2, -Math.PI / 2, 2 * Math.PI, irisColor, lineWidth, startTime, duration);
		part.add(_arc6);
	}

	parts.push(part);

	return parts;
};

animations.deadpool = function deadpool(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    duration = 300,
	    headColor = '#fa482a',
	    eyesColor = '#fff';

	var x = width / 2,
	    y = height / 2,
	    startTime = 0;

	// head
	var part = new Part(width, height);
	for (var i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration / 4;
		arc = new Arc([x, y], 104 + i * lineWidth * 2, -Math.PI / 2, -2 * Math.PI, headColor, lineWidth, startTime, duration);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);
	startTime = startTime + duration / 4;

	// nose
	part = new Part(width, height);
	for (var _i9 = 0, _arc7 = null; _i9 < 4; _i9++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x - 12 + _i9 * lineWidth * 2, y - 104], [x - 12 + _i9 * lineWidth * 2, y + 104], headColor, lineWidth, startTime, duration));
	}

	parts.unshift(part);
	startTime = startTime + duration / 4;

	// eyes
	part = new Part(width, height);
	for (var _i10 = 0, _arc8 = null; _i10 < 4; _i10++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x - 33, y - 10 + _i10 * lineWidth * 2.2], [x - 81, y - 25 + _i10 * lineWidth * 2.2], eyesColor, lineWidth, startTime, duration));

		part.add(new Line([x + 33, y - 10 + _i10 * lineWidth * 2.2], [x + 81, y - 25 + _i10 * lineWidth * 2.2], eyesColor, lineWidth, startTime, duration));
	}

	parts.unshift(part);

	return parts;
};

animations.fantastic = function fantastic(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    lineLength = 130,
	    duration = 300,
	    backColor = '#02557d',
	    color = '#fff';

	var part = new Part(width, height),
	    x = width / 2 + 20,
	    y = height / 2 + lineLength / 2,
	    endX = x,
	    endY = y - lineLength,
	    startTime = 0;

	for (var i = 0; i < 7; i++) {
		startTime = startTime + duration / 7;
		part.add(new Line([x + i * lineWidth, y], [endX + i * lineWidth, endY], i % 2 === 0 ? color : backColor, lineWidth, startTime, duration));
	}

	parts.push(part);

	part = new Part(width, height);
	x = width / 2 + 20;
	y = height / 2 - lineLength / 2;
	endX = width / 2 - lineLength / 2;
	endY = height / 2 + 20;
	startTime += duration / 6;
	for (var _i11 = 0; _i11 < 7; _i11++) {
		startTime = startTime + duration / 7;
		part.add(new Line([x, y + 1 + _i11 * lineWidth * 1.5], [endX + 1 + _i11 * lineWidth * 1.5, endY], _i11 % 2 === 0 ? color : backColor, lineWidth, startTime, duration));
	}

	parts.unshift(part);

	part = new Part(width, height);
	x = width / 2 - lineLength / 2;
	y = height / 2 + 20;
	endX = width / 2 + lineLength / 2;
	endY = height / 2 + 20;
	startTime += duration / 6;
	for (var _i12 = 0; _i12 < 7; _i12++) {
		startTime = startTime + duration / 7;
		part.add(new Line([x, y + _i12 * lineWidth], [endX, endY + _i12 * lineWidth], _i12 % 2 === 0 ? color : backColor, lineWidth, startTime, duration));
	}

	parts.push(part);

	part = new Part(width, height);
	startTime += duration / 6;
	for (var _i13 = 0, arc = null; _i13 < 4; _i13++) {
		startTime = startTime + duration / 4;
		arc = new Arc([width / 2, height / 2], lineLength / 2 + lineLength / 5 + _i13 * lineWidth * 2, -(Math.PI / 2), -2 * Math.PI, color, lineWidth, startTime, duration);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);

	return parts;
};

animations.flash = function flash(canvas) {
	var parts = [],
	    width = canvas.width,
	    height = canvas.height,
	    lineWidth = 4,
	    duration = 300,
	    sColor = '#ffbd3d',
	    circleColor = '#fff';

	var x = width / 2,
	    y = height / 2,
	    startTime = 0;

	// /
	var part = new Part(width, height);
	for (var i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x + 75, y - 160 + i * lineWidth * 3], [x - 60, y - 30 + i * lineWidth * 3], sColor, lineWidth, startTime, duration));
	}
	part.add(new ClearRect(x + 73, y - 161, lineWidth, lineWidth * 12, startTime - duration));
	part.add(new ClearRect(x - 59 - lineWidth, y - 30 - lineWidth, lineWidth, lineWidth * 12, startTime - duration));
	parts.push(part);

	// -
	part = new Part(width, height);
	for (var _i14 = 0, _arc9 = null; _i14 < 4; _i14++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x - 35 - _i14 * lineWidth * 2, y - 19 + _i14 * lineWidth * 2], [x - 35 - _i14 * lineWidth * 2 + 97, y - 19 + _i14 * lineWidth * 2], sColor, lineWidth, startTime, duration));
	}

	// /
	parts.push(part);
	part = new Part(width, height);
	for (var _i15 = 0, _arc10 = null; _i15 < 4; _i15++) {
		startTime = startTime + duration / 4;
		part.add(new Line([x + 65, y - 20 + _i15 * lineWidth * 3], [x - 80, y + 120 + _i15 * lineWidth * 3], sColor, lineWidth, startTime, duration));
	}
	part.add(new ClearRect(x + 62, y - 21, lineWidth, lineWidth * 12, startTime - duration));
	part.add(new ClearRect(x - 79 - lineWidth, y + 120 - lineWidth, lineWidth, lineWidth * 12, startTime - duration));
	parts.push(part);

	startTime = startTime + duration / 4;
	part = new Part(width, height);
	for (var _i16 = 0, _arc11 = null; _i16 < 4; _i16++) {
		startTime = startTime + duration / 4;
		_arc11 = new Arc([x, y], 133 - _i16 * lineWidth * 2, -(Math.PI / 3 + Math.PI / 15), -2 * Math.PI, circleColor, lineWidth, startTime, duration);
		_arc11.anticlockwise = true;
		part.add(_arc11);
	}

	part.add(new ClearQuad(x + 75, y - 160 + lineWidth * 4, x - 5, y - 160 + lineWidth * 24, lineWidth * 12, startTime - duration));
	part.add(new ClearQuad(x + 15, y + 30 + lineWidth * 4, x - 75, y + 35 + lineWidth * 24, lineWidth * 12, startTime - duration));

	parts.push(part);

	return parts;
};

launch(links[0]);

},{}]},{},[1]);
