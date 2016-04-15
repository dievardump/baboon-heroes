const easing = easeOutQuart;

function easeOutQuart(t, b, c, d) {
	t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};


class Shape {
	constructor() {
		this.ctx = null;
	}

	setContext(ctx) {
		this.ctx = ctx;
	}
}

export class Line extends Shape {
	constructor (start, end, color, lineWidth, timer, duration) {
		super()
		this.start = start;
		this.end = end;
		this.color = color;
		this.lineWidth = lineWidth;
		this.timer = timer;
		this.duration = duration;
	}

	draw(time) {
		if (time >= this.timer) {
			const ctx = this.ctx;
			let t = (time - this.timer);
			if (t > this.duration) {
				t = this.duration
			}
			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.lineWidth = this.lineWidth;
			let endX = easing(t, this.start[0], this.end[0] - this.start[0], this.duration),
			endY = easing(t, this.start[1], this.end[1] - this.start[1], this.duration);

			ctx.moveTo(this.start[0], this.start[1]);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.closePath();
		}
	}

	drawBack(time) {
		if (time <= this.duration) {
			const ctx = this.ctx;
			ctx.beginPath();
			ctx.strokeStyle = this.color;

			let startX = easing(time, this.start[0], this.end[0] - this.start[0], this.duration),
			startY = easing(time, this.start[1], this.end[1] - this.start[1], this.duration);
			ctx.moveTo(startX, startY);
			ctx.lineTo(this.end[0], this.end[1]);
			ctx.stroke();
			ctx.closePath();
		}
	}
}

export class Arc extends Shape {
	constructor (center, radius, start, length, color, lineWidth, timer, duration) {
		super();

		this.center = center;
		this.radius = radius;
		this.start = start; 
		this.length = length;
		this.color = color;
		this.lineWidth = lineWidth;
		this.timer = timer;
		this.anticlockwise = false;
		this.fill = false;
		this.duration = duration;
	}

	draw(time) {
		if (time >= this.timer) {
			const ctx = this.ctx;
			let t = (time - this.timer);
			if (t > this.duration) {
				t = this.duration;
			}

			const angle = easing(t, 0, this.length, this.duration),
				endPath = this.start + angle;

			ctx.beginPath();
			ctx.lineWidth = this.lineWidth;

			if (this.fill) {
				const x = this.center[0] + this.radius * Math.cos(this.start),
					y = this.center[1] + this.radius * Math.sin(this.start);
				ctx.moveTo(this.center[0], this.center[1]);
				ctx.lineTo(x, y);
				ctx.arc(this.center[0], this.center[1], this.radius, this.start,  endPath, this.anticlockwise);
				ctx.lineTo(this.center[0], this.center[1]);
				ctx.fillStyle = this.color;
				ctx.fill();
			} else {
				ctx.arc(this.center[0], this.center[1], this.radius, this.start,  endPath, this.anticlockwise);
				ctx.strokeStyle = this.color;
				ctx.stroke();
			}
			ctx.closePath();
		}
	}

	drawBack(time) {
		if (time <= this.duration) {
			const ctx = this.ctx;
			const angle = easing(time, 0, this.length, this.duration);
			const startPath = this.start + angle;

			ctx.beginPath();
			if (this.fill) {
				const x = this.center[0] + this.radius * Math.cos(startPath),
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
}



// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt,controlPt,endPt,percent) {
    var x = Math.pow(1-percent,2) * startPt[0] + 2 * (1-percent) * percent * controlPt[0] + Math.pow(percent,2) * endPt[0]; 
    var y = Math.pow(1-percent,2) * startPt[1] + 2 * (1-percent) * percent * controlPt[1] + Math.pow(percent,2) * endPt[1]; 
    return [x, y];
}

export class CurveQuad extends Shape {
	constructor (start, end, control, color, lineWidth, timer, duration) {
		super();

		this.start = start;
		this.end = end;
		this.control = control;

		this.color = color;
		this.lineWidth = lineWidth;
		this.timer = timer;

		this.duration = duration;
	}

	draw(time) {
		if (time >= this.timer) {
			const ctx = this.ctx;
			let t = (time - this.timer);
			if (t > this.duration) {
				t = this.duration;
			}


			
			const perc = t/this.duration,
				endPt = getQuadraticBezierXYatPercent(this.start, this.control, this.end, perc),
				controlPt = [ this.start[0] + ~~((this.control[0] - this.start[0]) * perc), this.start[1] + ~~((this.control[1] - this.start[1]) * perc)];

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

	drawBack(time) {
		if (time <= this.duration) {
			const ctx = this.ctx;

			const perc = time/this.duration,
				startPt = getQuadraticBezierXYatPercent(this.start, this.control, this.end, perc),
				controlPt = [ this.end[0] + ~~((this.control[0] - this.end[0]) * perc), this.end[1] + ~~((this.control[1] - this.end[1]) * perc)];

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
}

class Clear extends Shape {
	constructor() {
		super();
	}

	draw() {

	}

	drawBack(time) {
		this.draw(this.time);
	}
}

export class ClearRect extends Clear {
	constructor(x, y, width, height, time) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.time = time;
	}

	draw(t) { 
		if (t >= this.time) {
			const ctx = this.ctx;
			ctx.clearRect(this.x, this.y, this.width, this.height);
		}
	}
}

export class ClearQuad extends Clear {
	constructor(x, y, x2, y2, height, time) {
		super();
		this.x = x;
		this.y = y;
		this.x2 = x2;
		this.y2 = y2;
		this.height = height;
		this.time = time;
	}

	draw(t) { 
		if (t >= this.time) {
			const ctx = this.ctx;

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
}

export class ClearArc extends Clear {
	constructor(center, radius, time) {
		super();
		this.center = center;
		this.radius = radius;
		this.time = time;
	}

	draw(t) {
		if (t >= this.time) {
			const ctx = this.ctx,
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
}

export class Part {
	constructor(width, height, debug = false) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');

		this.delay = 0;
		this.delayBack = 0;

		this.shapes = [];

		if (debug)
			document.body.appendChild(this.canvas);
	}

	draw(t) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.shapes.forEach( (shape) => {
			shape.draw(t);
		});
	}

	drawBack(t) {
		if (t > this.delayBack) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.shapes.forEach( (shape) => {
				shape.drawBack(t - this.delayBack);
			});
		}
	}

	add(shape) {
		shape.setContext(this.ctx);
		this.shapes.push(shape);
	}

	ended(t) {
		let finish = true;
		this.shapes.forEach( (shape) => {
			if (shape.duration) {
				finish = finish && (t >= (shape.timer + shape.duration));
			}
		});

		return finish;
	}

	endedBack(t) {
		const delay = this.delayBack;
		let finish = true;
		this.shapes.forEach( (shape) => {
			if (shape.duration) {
				finish = finish && (t >= (shape.duration + delay));
			}
		});

		return finish;
	}
}


export function animate(canvas, parts) {
	const ctx = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;

	let reqStart = null;
	function forward(time = 0) {
		time = ~~time;
		if (reqStart === null) {
			reqStart = time;
		}

		let progress = time - reqStart,
			ended = true;

		ctx.clearRect(0, 0, width, height);
		parts.forEach( (part) => {
			part.draw(progress);
			ctx.drawImage(part.canvas, 0, 0);
			ended = ended && part.ended(progress);
		});

		if (!ended) {
			requestAnimationFrame(forward);
		} else {
			reqStart = null;
			setTimeout(() => requestAnimationFrame(backward), 1000);
		}
	}

	function backward(time) {
		let finish = true;
		time = ~~time;
		if (reqStart === null) {
			reqStart = time;
		}

		let progress = time - reqStart;
		ctx.clearRect(0, 0, width, height);

		parts.forEach( (part) => {
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