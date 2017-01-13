$(window).ready(function() {
	$('#start-btn').click(start);
});

var count = -1;

var lastPos = [0, 0, 0];

function start() {
	if (count !== -1) {
		return;
	}

	console.log('start');

	count = 0;

	$.ajax({
		url: '/api/lucky',
		success: function(res) {
			var ul1 = $('#1st-slot > ul')[0];
			var ul2 = $('#2nd-slot > ul')[0];
			var ul3 = $('#3rd-slot > ul')[0];

			move(ul1, lastPos[0], 0, res.arr[0]);
			move(ul2, lastPos[1], 0, res.arr[1]);
			move(ul3, lastPos[2], 0, res.arr[2]);

			lastPos = res.arr;
		}
	});
}

function finish() {
	count++;

	if (count === 3) {
		count = -1;

		console.log('done');
	}
}

setInterval(function() {
	TWEEN.update();
}, 17);

function toNumber(ul, from, to, times, target, cont) {
	var pos = {
		top: -(from * 200),
	};

	var tween = new TWEEN.Tween(pos)
	.to({
		top: -(to * 200),
	}, Math.abs(from - to) * 400)
	.onUpdate(function() {
		ul.style.top = pos.top + 'px';
	})
	.onComplete(function() {
		if (!cont) {
			return finish();
		}

		move(ul, to, times, target);
	})
	.easing(cont ? TWEEN.Easing.Quadratic.InOut : TWEEN.Easing.Back.InOut)
	.start();
}

function move(ul, from, times, target) {
	console.log('move', target);
	if (times < 5) {
		toNumber(ul, from, (times % 2) * 9, times + 1, target, true);
	} else {
		console.log('done 3 times');

		toNumber(ul, from, target, times + 1);
	}
}
