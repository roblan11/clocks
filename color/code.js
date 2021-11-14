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
			settings.mode = settings.mode === 'dark' ? 'light' : 'dark'
			clock.update()
			break
	}
})

const settings = {
	interval: 1,
	mode: 'dark',
	hueLoop: 'h',
	brightLoop: 'd',
	colors: {
		dark: {
			base: 25,
			txt_base: 70,
			deviation: 5
		},
		light: {
			base: 90,
			txt_base: 40,
			deviation: 5
		}
	}
}

function update(date) {
	document.getElementById('s').innerHTML = date.sf
	document.getElementById('m').innerHTML = date.mf
	document.getElementById('h').innerHTML = date.hf
	document.getElementById('W').innerHTML = date.df
	document.getElementById('D').innerHTML = date.Df
	document.getElementById('M').innerHTML = date.Mf
	document.getElementById('Y').innerHTML = date.Yf

	updateColor(date)
}

function scalarToRad(a) {
	return a * Math.PI * 2 / 360
}

function updateColor(date) {

	// --------------------------------- COLOR ---------------------------------
	let hue
	if (settings.hueLoop == 'd') { // 24h loop
		hue = 15 * date.h + 0.25 * date.m
	} else if (settings.hueLoop == 'h') { // 1h loop
		hue = 6 * date.m + 0.1 * date.s
	} else if (settings.hueLoop == 'm') { // 1m loop
		hue = 6 * date.s + 0.006 * date.ms
	} else { // static
		hue = 315
	}

	// ------------------------------- BRIGHTNESS ------------------------------
	let lightness_deg
	if (settings.brightLoop == 'd') { // 24h loop
		lightness_deg = 15 * date.h + 0.25 * date.m
	} else if (settings.brightLoop == 'h') { // 1h loop
		lightness_deg = 6 * date.m + 0.1 * date.s
	} else if (settings.brightLoop == 'm') { // 1m loop
		lightness_deg = 6 * date.s + 0.006 * date.ms
	} else { // static
		lightness_deg = 90
	}

	const setting = settings.colors[settings.mode]
	const lightness_dev = -Math.cos(scalarToRad(lightness_deg)) * setting.deviation
	let lightness = setting.base + lightness_dev
	let lightness_txt = setting.txt_base + lightness_dev

	document.getElementById('bg').style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`
	document.getElementById('container').style.color = `hsl(${hue}, 100%, ${lightness_txt}%)`
}

clock = new Clock(update, settings.interval)
