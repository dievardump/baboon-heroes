import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	duration = 300,
	color = '#fcb02d';

animate(canvas, populate());

function populate () {
	const parts = [];

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
}