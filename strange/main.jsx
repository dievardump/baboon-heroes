import { Line, Arc, CurveQuad, ClearRect, ClearQuad, ClearArc, Part, animate } from '../base.js';

const canvas = document.querySelector('canvas'),
	width = canvas.width,
	height = canvas.height,
	lineWidth = 4,
	duration = 300,
	eyeColor = '#ffdc3d',
	irisColor = '#a6ceff';


animate(canvas, populate());

function populate () {
	const parts = [];

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
}