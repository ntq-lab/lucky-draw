'use strict';

const express = require('express');
const nodeRandom = require('node-random');
const request = require('request');

function random() {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://www.random.org/integers/',
			method: 'get',
			qs: {
				num: 3,
				min: 1,
				max: 10,
				base: 10,
				format: 'plain',
				col: 1,
			},
		}, function(err, res, body) {
			if (res.statusCode === 200) {
				return resolve(processTextResult(body));
			}

			reject(err || new Error(res.statusCode));
		});
	});
}


function processTextResult(text) {
	return text
		.trim()
		.split('\n')
		.map((n) => parseInt(n, 10) - 1);
}

const app = express();

app.use('/node_modules', express.static('node_modules'));
app.use('/public', express.static('public'));
app.use(express.static('public'));

app.get('/api/lucky', (req, res, next) => {
	random()
		.then((nums) => {
			res.json({
				arr: nums,
			});
		})
		.catch(function(e) {
			// fallback
			nodeRandom.integers({
				number: 3,
				minimum: 0,
				maximum: 9,
				colums: 1,
				base: 10
			}, function(error, nums) {
				res.json({
					arr: nums,
				});
			})
		});
});

app.listen(3333, () => console.log('Started at :3333'));
