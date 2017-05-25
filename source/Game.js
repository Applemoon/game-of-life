(function(global) {

	let _CANVAS  = null;

	(function(document) {

		let canvas = document.querySelector('canvas');
		if (canvas === null) {
			canvas = document.createElement('canvas');
			canvas.width  = 1000;
			canvas.height = 800;
		}


		if (canvas.parentNode === null) {

			document.addEventListener('DOMContentLoaded', function() {
				document.body.appendChild(canvas);
			}, true);

		}

		_CANVAS  = canvas;
		_CONTEXT = canvas.getContext('2d');

	})(global.document);


	const Game = function() {
		this.fps = 60;
		this._has_ended  = false;
	}

	Game.prototype = {
		setFPS: function(val) {

			val = typeof val === 'number' ? (val | 0) : 60;

			if (val > 0) {
				this.fps = val;
			}

		},

		start: function() {
		},

		stop: function() {
			this._has_ended = true;
		},

		render: function() {
		},

		update: function() {
		},
	};

	global.Game = Game;

})(this);