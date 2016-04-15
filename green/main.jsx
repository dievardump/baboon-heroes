import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	duration = 300,
	color = '#359a22';

animate(canvas, populate());

function populate () {
	const parts = [];

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
}

