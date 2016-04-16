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

class Line extends Shape {
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

class Arc extends Shape {
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

class CurveQuad extends Shape {
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

class ClearRect extends Clear {
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

class ClearQuad extends Clear {
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

class ClearArc extends Clear {
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

class Part {
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


class animate {
	constructor(canvas) {
		this.canvas = canvas;		
		this.ctx = canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.stopped = true;
		this.reqStart = null;
		this.parts = [];
		this.reqId = null;
	}

	load(parts) {
		this.parts = parts;
		this.stopped = false;
		this.animate();
	}	

	stop() {
		this.stopped = true;
		cancelAnimationFrame(this.reqId);
	}

	animate() {
		this.reqStart = null;
		this.reqId = requestAnimationFrame(this.forward.bind(this));
	}

	forward(time = 0) {
		if (!this.stopped) {
			const parts = this.parts,
				ctx = this.ctx;

			time = ~~time;
			if (this.reqStart === null) {
				this.reqStart = time;
			}

			let progress = time - this.reqStart,
				ended = true;

			ctx.clearRect(0, 0, this.width, this.height);
			parts.forEach( (part) => {
				part.draw(progress);
				ctx.drawImage(part.canvas, 0, 0);
				ended = ended && part.ended(progress);
			});

			if (!ended) {
				this.reqId = requestAnimationFrame(this.forward.bind(this));
			} else {
				this.reqStart = null;
				setTimeout(() => this.reqId = requestAnimationFrame(this.backward.bind(this)), 1000);
			}
		}
	}

	backward(time) {
		if (!this.stopped) {
			const parts = this.parts,
				ctx = this.ctx;			

			let finish = true;
			time = ~~time;
			if (this.reqStart === null) {
				this.reqStart = time;
			}

			let progress = time - this.reqStart;
			ctx.clearRect(0, 0, this.width, this.height);

			parts.forEach( (part) => {
				part.drawBack(progress);
				ctx.drawImage(part.canvas, 0, 0);
				finish = finish && part.endedBack(progress);
			});

			if (!finish) {
				this.reqId = requestAnimationFrame(this.backward.bind(this));  
			} else {
				setTimeout(this.animate.bind(this), 1500);
			}
		}
	}
}



const links = Array.from(document.querySelectorAll('a[data-anim]')),
	canvas = document.querySelector('canvas'),
	animations = {};

let anim = null;

links.forEach( (link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		launch(link);
	}, false);
});

function launch(link) {
	const fnName = link.getAttribute('data-anim');
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
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		duration = 300,
		color = '#fcb02d';

	let x = width/2,
		y = height/2 - 130,
		endX = x - 105,
		endY = y + 170,
		startTime = 0;

	// left side
	let part = new Part(width, height);
	for(let i = 0; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x + 2, y + 1 + i * lineWidth * 3.5],
			[(endX + i * lineWidth * 1.3), endY + i * lineWidth * 1.5],
			color,
			lineWidth,
			startTime,
			duration
		));
	}
	part.add(new ClearRect(x, y, x+lineWidth, y+lineWidth*3*5, startTime-duration));
	part.add(new ClearQuad(endX - 1, endY - lineWidth, endX+lineWidth*6, endY+lineWidth*2.5, lineWidth * 6, startTime-duration));

	parts.push(part);

	startTime = startTime + duration/4;

	// right side
	part = new Part(width, height);
	endX = x + 105;
	for(let i = 0; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x - 2, y + 1 + i * lineWidth * 3.5],
			[(endX - i * lineWidth * 1.3), endY + i * lineWidth * 1.5],
			color,
			lineWidth,
			startTime,
			duration
		));
	}
	part.add(new ClearRect(x-lineWidth, y, lineWidth, y+lineWidth*3*5, startTime-duration));
	part.add(new ClearQuad(endX + 1, endY - lineWidth, endX-lineWidth*6, endY+lineWidth*2.5, lineWidth * 6, startTime-duration));

	parts.push(part);

	startTime = startTime + duration;

	// down side
	part = new Part(width, height);
	y = height / 2;

	for(let i = 0; i < 4; i++) {
		part.add(new Line(
			[x - 100 - i * lineWidth * 1, y + 28 + i * lineWidth * 1.5],
			[x - 40, y + 28 + i * lineWidth * 2 + 8 * lineWidth],
			color,
			lineWidth,
			startTime + (4-i) * duration/4,
			duration
		));

		part.add(new Line(
			[x + 100 + i * lineWidth * 1, y + 28 + i * lineWidth * 1.5],
			[x + 40, y + 28 + i * lineWidth * 2 + 8 * lineWidth],
			color,
			lineWidth,
			startTime + (4-i) * duration/4,
			duration
		));
	}
	
	part.add(new ClearArc([width/2, height/2+81], 45, startTime));

	parts.push(part);

	startTime = startTime + duration + duration/4;

	// circles middle
	part = new Part(width, height);
	y = height / 2;
	for(let i = 0; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Arc(
			[width/2, height/2 + 81],
			47 + i * lineWidth * 2,
			(Math.PI + Math.PI / 6),
			2 * Math.PI/3,
			color,
			lineWidth,
			startTime,
			duration
		));

	}

	parts.push(part);
	return parts;
};


animations.green = function green (canvas) {
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		duration = 300,
		color = '#359a22';

	let x = width/2,
		y = height/2,
		startTime = 0;

	// head
	let part = new Part(width, height),
		arc = new Arc(
			[x, y],
			145,
			-Math.PI/2,
			-2 * Math.PI,
			'#fff',
			lineWidth,
			startTime,
			duration
		);
	arc.anticlockwise = true;
	arc.fill = true;
	part.add(arc);
	parts.push(part);
	part.delayBack = duration;
	startTime = startTime + duration;

	// top
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x - 77, y - 77 + i * lineWidth * 2],
			[x + 77, y - 77 + i * lineWidth * 2],
			color,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.push(part);
	startTime = startTime + duration/4;

	// bottom
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x + 77, y + 77 - i * lineWidth * 2],
			[x - 77, y + 77 - i * lineWidth * 2],
			color,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.push(part);
	startTime = startTime + duration/4;


	// center
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[x, y],
			77 - i * lineWidth * 2,
			-Math.PI/2,
			-2 * Math.PI,
			color,
			lineWidth,
			startTime,
			duration
		);
		arc.anticlockwise = true;
		part.add(arc);
	}

	part.add(new ClearRect(x-77, y-80, 145, 27, startTime-duration));
	part.add(new ClearRect(x-77, y+53, 145, 27, startTime-duration));

	parts.push(part);

	return parts;
};


animations.strange = function strange(canvas) {
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		duration = 300,
		eyeColor = '#ffdc3d',
		irisColor = '#a6ceff';

	let x = width/2,
		y = height/2,
		startTime = 0;

	// eye
	let part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[x, y],
			135 - i * lineWidth * 2,
			-Math.PI/2,
			-2 * Math.PI,
			eyeColor,
			lineWidth,
			startTime,
			duration
		);
		arc.anticlockwise = true;
		part.add(arc);
	}
	
	parts.push(part);
	startTime = startTime + duration;

	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/2;
		part.add(new CurveQuad(
			[x - 99 - i * lineWidth * 1.05, y-50 + i*1.5 * lineWidth * 2.7],
			[x + 99 + i * lineWidth * 1.05, y-50 + i *1.5 * lineWidth * 2.7],
			[x, y - 120 + lineWidth*0.5],
			eyeColor,
			lineWidth,
			startTime,
			duration/4
		));
	}
	parts.push(part);
	startTime = startTime + duration;

	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/2;
		part.add(new CurveQuad(
			[x + 99 + i * lineWidth * 1.05, y+50 - i *1.5 * lineWidth * 2.7],
			[x - 99 - i * lineWidth * 1.05, y+50 - i * 1.5 * lineWidth * 2.7],
			[x, y + 120 - lineWidth*0.5],
			eyeColor,
			lineWidth,
			startTime,
			duration/4
		));
	}
	parts.push(part);
	startTime = startTime + duration;


	// iris
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[x, y],
			50 - i * lineWidth * 2,
			-Math.PI/2,
			2 * Math.PI,
			irisColor,
			lineWidth,
			startTime,
			duration
		);
		part.add(arc);
	}
	
	parts.push(part);

	return parts;
};


animations.deadpool = function deadpool(canvas) {
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		duration = 300,
		headColor = '#fa482a',
		eyesColor = '#fff';

	let x = width/2,
		y = height/2,
		startTime = 0;

	// head
	let part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[x, y],
			104 + i * lineWidth * 2,
			-Math.PI/2,
			-2 * Math. PI,
			headColor,
			lineWidth,
			startTime,
			duration
		);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);
	startTime = startTime + duration/4;

	// nose
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x-12 + i * lineWidth * 2, y - 104],
			[x-12 + i * lineWidth * 2, y + 104],
			headColor,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.unshift(part);
	startTime = startTime + duration/4;

	// eyes
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x - 33, y - 10 + i * lineWidth * 2.2],
			[x - 81, y - 25 + i * lineWidth * 2.2],
			eyesColor,
			lineWidth,
			startTime,
			duration
		));

		part.add(new Line(
			[x + 33, y - 10 + i * lineWidth * 2.2],
			[x + 81, y - 25 + i * lineWidth * 2.2],
			eyesColor,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.unshift(part);
	
	return parts;
};

animations.fantastic = function fantastic (canvas) {
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		lineLength = 130,
		duration = 300,
		backColor = '#02557d',
		color = '#fff';

	let part = new Part(width, height),
	x = width/2 + 20,
	y = height/2 + lineLength/2,
	endX = x,
	endY = y - lineLength,
	startTime = 0;

	for(let i = 0; i < 7; i++) {
		startTime = startTime + duration/7;
		part.add(new Line(
			[(x + i * lineWidth), y],
			[(endX + i * lineWidth), endY],
			(i%2 === 0) ? color : backColor,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.push(part);

	part = new Part(width, height);
	x = width/2 + 20;
	y = height/2 - lineLength/2;
	endX = width/2 - lineLength/2;
	endY = height/2 + 20;
	startTime += duration/6;
	for(let i = 0; i < 7; i++) {
		startTime = startTime + duration/7;
		part.add(new Line(
			[x, y + 1 + i * lineWidth * 1.5],
			[(endX + 1 + i * lineWidth * 1.5), endY],
			(i%2 === 0) ? color : backColor,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.unshift(part);


	part = new Part(width, height);
	x = width/2 - lineLength/2;
	y = height/2 + 20;
	endX = width/2 + lineLength/2;
	endY = height/2 + 20;
	startTime += duration/6;
	for(let i = 0; i < 7; i++) {
		startTime = startTime + duration/7;
		part.add(new Line(
			[x, y + i * lineWidth],
			[(endX), endY + i * lineWidth],
			(i%2 === 0) ? color : backColor,
			lineWidth,
			startTime,
			duration
		));
	}

	parts.push(part);

	part = new Part(width, height);
	startTime += duration/6;
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[width/2, height/2],
			lineLength/2 + lineLength/5 + i * lineWidth * 2,
			- (Math.PI / 2),
			- 2 * Math.PI,
			color, 
			lineWidth,
			startTime,
			duration
		);
		arc.anticlockwise = true;
		part.add(arc);
	}

	parts.push(part);
	
	return parts;
};

animations.flash = function flash(canvas) {
	const parts = [],
		width = canvas.width,
		height = canvas.height,
		lineWidth = 4,
		duration = 300,
		sColor = '#ffbd3d',
		circleColor = '#fff';

	let x = width/2,
		y = height/2,
		startTime = 0;

	// /
	let part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x+75, y - 160 + i * lineWidth * 3],
			[x-60, y - 30 + i * lineWidth * 3],
			sColor,
			lineWidth,
			startTime,
			duration
		));
	}
	part.add(new ClearRect(x+73, y - 161, lineWidth, lineWidth*12, startTime-duration));
	part.add(new ClearRect(x-59-lineWidth, y - 30 - lineWidth, lineWidth, lineWidth*12, startTime-duration));
	parts.push(part);

	// -
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x - 35 - (i*lineWidth * 2), y - 19 + i * lineWidth * 2],
			[x - 35 - (i*lineWidth * 2) + 97, y - 19 + i * lineWidth * 2],
			sColor,
			lineWidth,
			startTime,
			duration
		));
	}

	// /
	parts.push(part);
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		part.add(new Line(
			[x + 65, y - 20 + i * lineWidth * 3],
			[x - 80, y + 120 + i * lineWidth * 3],
			sColor,
			lineWidth,
			startTime,
			duration
		));
	}
	part.add(new ClearRect(x+62, y - 21, lineWidth, lineWidth*12, startTime-duration));
	part.add(new ClearRect(x-79-lineWidth, y + 120 - lineWidth, lineWidth, lineWidth*12, startTime-duration));
	parts.push(part);
	
	startTime = startTime + duration/4;
	part = new Part(width, height);
	for(let i = 0, arc = null; i < 4; i++) {
		startTime = startTime + duration/4;
		arc = new Arc(
			[x, y],
			133 - i * lineWidth * 2,
			-(Math.PI/3 + Math.PI/15) ,
			-2 * Math. PI,
			circleColor,
			lineWidth,
			startTime,
			duration
		);
		arc.anticlockwise = true;
		part.add(arc);
	}

	part.add(new ClearQuad(x+75, y-160 + lineWidth*4, x-5, y-160+lineWidth * 24, lineWidth*12, startTime-duration));
	part.add(new ClearQuad(x+15, y+30 + lineWidth*4, x-75, y+35+lineWidth * 24, lineWidth*12, startTime-duration));

	parts.push(part);
	
	return parts;
};

launch(links[0]);