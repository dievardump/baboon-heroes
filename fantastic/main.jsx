import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	lineLength = 130,
	duration = 300,
	backColor = '#02557d',
	color = '#fff';

animate(canvas, populate());

function populate () {
	const parts = [];
	// head
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
}