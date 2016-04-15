import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	duration = 300,
	sColor = '#ffbd3d',
	circleColor = '#fff';


animate(canvas, populate());

function populate () {
	const parts = [];

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
}