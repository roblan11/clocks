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
	['E','S','I','S','C','H',' ','Z','Ä','H'],
	['F','Ü','F','V','I','E','R','T','E','L'],
	['Z','W','Ä','N','Z','G',' ',' ','A','B'],
	['V','O','R',' ',' ','H','A','L','B','I'],
	['S','I','B','N','I','Z','Ä','H','N','I'],
	['Z','W','Ö','L','F','I','F','Ü','F','I'],
	['D','R','Ü','E','I','S','Z','W','E','I'],
	['N','Ü','N','I','S','Ä','C','H','S','I'],
	['V','I','E','R','I','A','C','H','T','I'],
	['E','L','F','I',' ',' ','A','M','P','M']
]

const various = {
	esisch: [ 0,  5],
	vor:    [30, 32],
	ab:     [28, 29],
	am:     [96, 97],
	pm:     [98, 99]
}

const minutes = {
	0:  [ 6,  6],
	5:  [10, 12],
	10: [ 7,  9],
	15: [13, 19],
	20: [20, 25],
	25: [10, 12, 30, 32, 35, 39],
	30: [35, 39],
	35: [10, 12, 28, 29, 35, 39]
}

const hours = {
	0:  [50, 55],
	1:  [63, 65],
	2:  [66, 69],
	3:  [60, 62],
	4:  [80, 84],
	5:  [56, 59],
	6:  [74, 79],
	7:  [40, 44],
	8:  [85, 89],
	9:  [70, 73],
	10: [45, 49],
	11: [90, 93],
	12: [50, 55]
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

	enable(various.esisch)

	let h = date.h
	let m = Math.round(date.m / 5) * 5

	if (m == 0) {
		// nothing
	} else if (m == 60) {
		m = 0
		h = (h + 1) % 24
	} else if (m >= 25 && m <= 35) {
		h = (h + 1) % 24
	} else if (m > 35) {
		enable(various.vor)
		h = (h + 1) % 24
		m = Math.round((60 - m) / 5) * 5
	} else {
		enable(various.ab)
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
