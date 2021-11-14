import Clock from '../clock.js'
let clock

window.addEventListener('keypress', e => {
	switch (e.keyCode) {
		case 32:
			// SPACE: reset time
			update()
			break
		case 98:
			// B: toggle bright/dark mode
			toggleBrightmode()
			break
	}
})

const settings = {
	interval: 30,
	mode: 'dark',
	colors: {
		dark: {
			bg: '#323232',
			text: '#C8C8C8'
		},
		light: {
			bg: '#C8C8C8',
			text: '#323232'
		}
	}
}

function toggleBrightmode() {
	if (settings.mode == 'dark') {
		settings.mode = 'light'
	} else {
		settings.mode = 'dark'
	}
	d3.select('#container').attr('style', `background-color: ${settings.colors[settings.mode].bg}; color: ${settings.colors[settings.mode].text};`)
}

const letters =
[
	['I','T',' ','I','S',' ','H','A','L','F'],
	['T','E','N','Q','U','A','R','T','E','R'],
	['T','W','E','N','T','Y','F','I','V','E'],
	['P','A','S','T','O',' ','N','I','N','E'],
	['F','O','U','R','E','L','E','V','E','N'],
	['E','I','G','H','T','T','H','R','E','E'],
	['S','I','X','T','E','N','O','O','N','E'],
	['M','I','D','N','I','G','H','T','W','O'],
	['F','I','V','E','E','L','E','V','E','N'],
	['S','E','V','E','N',' ','A','M','P','M']
]

const various = {
	itis: [ 0,  4],
	to:   [33, 34],
	past: [30, 33],
	am:   [96, 97],
	pm:   [98, 99]
}

const minutes = {
	0:  [ 5,  5],
	5:  [26, 29],
	10: [10, 12],
	15: [13, 19],
	20: [20, 25],
	25: [20, 29],
	30: [ 6,  9]
}

const hours = {
	0:  [70, 77],
	1:  [67, 69],
	2:  [77, 79],
	3:  [55, 59],
	4:  [40, 43],
	5:  [80, 83],
	6:  [60, 62],
	7:  [90, 94],
	8:  [50, 54],
	9:  [36, 39],
	10: [63, 65],
	11: [44, 49],
	12: [65, 68]
}

let COUNT = 0;

let table = d3.select('#container')
	.attr('style', `background-color: ${settings.colors[settings.mode].bg}; color: ${settings.colors[settings.mode].text};`)
	.append('table')

for (let row in letters) {
	let tr = table.append('tr');
	for (let col in letters[row]) {
		tr.append('th')
			.text(letters[row][col])
			.attr('id', 'letter' + COUNT)
		COUNT++
	}
}

function update(date) {
	disable_all();

	enable(various.itis)

	let h = date.h
	let m = Math.round(date.m / 5) * 5

	if (m == 0) {
		// oclock ?
	} else if (m == 60) {
		m = 0
		h = (h + 1) % 24
	} else if (m > 30) {
		enable(various.to)
		h = (h + 1) % 24
		m = Math.round((60 - m) / 5) * 5
	} else {
		enable(various.past)
	}
	enable(minutes[m])

	if (h > 12) {
		h -= 12
	}
	enable(hours[h])

	if (date.h >= 12) {
		enable(various.pm)
	} else {
		enable(various.am)
	}
}

function disable_all() {
	table.selectAll('th')
		.attr('class', 'off')
}

function enable(list) {
	for (let idx = 0; idx < list.length; idx += 2) {
		for (let i = list[idx]; i <= list[idx+1]; i++) {
			d3.select('#letter'+i).attr('class', 'on')
		}
	}
}

clock = new Clock(update, settings.interval)
