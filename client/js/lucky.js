$(window).ready(function() {
	$('#start-btn').click(start);
});

var count = -1;

var lastPos = [0, 0, 0];
var height = 290;

function start() {
	if (count !== -1) {
		return;
	}

	console.log('start');
	$('#start-btn')
		.text('WAITING')
		.attr('disabled', 'disabled')
		.addClass('blink');

	count = 0;

	$.ajax({
		url: '/api/lucky',
		success: function(res) {
			var ul1 = $('#slot-1st > ul')[0];
			var ul2 = $('#slot-2nd > ul')[0];
			var ul3 = $('#slot-3rd > ul')[0];

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
		$('#start-btn')
			.text('START')
			.removeAttr('disabled')
			.removeClass('blink');
	}
}

setInterval(function() {
	TWEEN.update();
}, 17);

function toNumber(ul, from, to, times, target, cont) {
	var pos = {
		top: -(from * height),
	};

	var tween = new TWEEN.Tween(pos)
	.to({
		top: -(to * height),
	}, Math.abs(from - to) * 300)
	.onUpdate(function() {
		ul.style.top = pos.top + 'px';
	})
	.onComplete(function() {
		if (!cont) {
			return finish();
		}

		move(ul, to, times, target);
	})
	.easing(cont ? TWEEN.Easing.Quadratic.InOut : TWEEN.Easing.Circular.InOut)
	.start();
}

function move(ul, from, times, target) {
	console.log('move', target);
	if (times < 4) {
		toNumber(ul, from, (times % 2) * 9, times + 1, target, true);
	} else {
		// finish
		toNumber(ul, from, target, times + 1);
	}
}
