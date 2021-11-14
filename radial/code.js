import Clock from '../clock.js'
let clock

window.addEventListener('keypress', e => {
	switch (e.keyCode) {
		case 32:
			// SPACE: reset time
			clock.update()
			break
		case 98:
			// B: toggle bright/dark mode
			toggleBrightmode()
			clock.update()
			break
	}
})

const settings = {
	interval: 0.1,
	mode: 'dark',
	radii: [1, 0.9, 0.8, 0.65, 0.55, 0.45],
	arcWidth: 0.09,
	colors: {
		dark: {
			bg: '#212121',
			text: 'white',
			arc: 'rgba(255, 255, 255, 0.2)'
		},
		light: {
			bg: '#dedede',
			fill: 'black',
			arc: 'rgba(0, 0, 0, 0.2)'
		}
	}
}


function toggleBrightmode() {
	if (settings.mode === 'dark') {
		settings.mode = 'light'
	} else {
		settings.mode = 'dark'
	}
	d3.select('#bg').attr('style', `background-color: ${settings.colors[settings.mode].bg}`)
	d3.selectAll('text').attr('fill', settings.colors[settings.mode].text)
	d3.selectAll('path').attr('fill', settings.colors[settings.mode].arc)
}

function scalarToRad(a) {
	return a * Math.PI * 2
}

const CENTER = {H: window.innerHeight / 2, W: window.innerWidth / 2}
const RADIUS = Math.min(CENTER.H, CENTER.W) * 0.8

const svg = d3.select('#svg')
const svg_arcs = svg.append('g').attr('transform', `translate(${CENTER.W},${CENTER.H})`)
const svg_times = svg.append('g').attr('transform', `translate(${CENTER.W},${CENTER.H})`)

const arcs = []
const paths = []
const times = []

settings.radii.forEach(r => {
	const arc = d3.arc()
	arcs.push(arc)
	arc.outerRadius(r * RADIUS)
		.innerRadius((r - settings.arcWidth) * RADIUS)
		.startAngle(0)
		.endAngle(1)

	const path = svg_arcs.append('path')
		.attr('d', arc)
		.attr('fill', settings.colors[settings.mode].arc)
	paths.push(path)

	const time = svg_times.append('text')
		.attr('y', -(r - settings.arcWidth + 0.02) * RADIUS )
		.attr('text-anchor', 'middle')
		.text(r)
		.attr('fill', settings.colors[settings.mode].text)
		times.push(time)
})

function daysPerMon(M, Y) {
	if (M%2 === 0) {
		return 31
	} else if (M === 1) {
		if ((Y%4 === 0) && (Y%100 !== 0 || Y%400 === 0)) {
			return 29
		} else {
			return 28
		}
	} else {
		return 30
	}
}

function update(date) {
	const days_in_month = daysPerMon(date.M, date.Y)
	const angles = [
		date.s / 60 + date.ms / 60000,
		date.m / 60 + date.s / 3600,
		date.h / 24 + date.m / 1440,
		date.d / 7 + date.h / 168,
		date.D / days_in_month + date.h / (days_in_month*24),
		date.M / 12 + date.D / (12*days_in_month)
	]
	angles.forEach((a, i) => {
		arcs[i].endAngle(scalarToRad(a))
		paths[i].attr('d', arcs[i])
	})

	const texts = [
		date.sf,
		date.mf,
		date.hf,
		date.df,
		date.Df,
		date.Mf
	]
	texts.forEach((a, i) => {
		times[i].text(a)
	})
}

clock = new Clock(update, settings.interval)
