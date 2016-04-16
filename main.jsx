import { animate } from './common.js';

import { aquaman } from './aquaman/main.jsx';
import { deadpool } from './deadpool/main.jsx';
import { fantastic } from './fantastic/main.jsx';
import { flash } from './flash/main.jsx';
import { green } from './green/main.jsx';
import { strange } from './strange/main.jsx';

const links = Array.from(document.querySelectorAll('a[data-anim]')),
	canvas = document.querySelector('canvas'),
	animations = {};

animations.aquaman = aquaman;
animations.deadpool = deadpool;
animations.fantastic = fantastic;
animations.flash = flash;
animations.green = green;
animations.strange = strange;

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

if (links.length) {
	launch(links[0]);
}