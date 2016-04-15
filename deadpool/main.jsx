import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	duration = 300,
	headColor = '#fa482a',
	eyesColor = '#fff';

animate(canvas, populate());

function populate () {
	const parts = [];
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
}