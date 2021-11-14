export default class Clock {
	constructor(callback, interval) {
		this.wdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
		this.months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

		this.callback = callback
		this.interval = interval * 1000
		this.update()
	}

	update = () => {
			this.callback(this.getDateObj())
			setTimeout(this.update, this.interval)
	}

	getDateObj() {
		const date = new Date()
		let obj = {
			ms: date.getMilliseconds(),
			s: date.getSeconds(),
			m: date.getMinutes(),
			h: date.getHours(),
			d: date.getDay() == 0 ? 6 : date.getDay()-1,
			D: date.getDate(),
			M: date.getMonth(),
			Y: date.getFullYear()
		}

		obj.sf = this.format2Digit(obj.s)
		obj.mf = this.format2Digit(obj.m)
		obj.hf = this.format2Digit(obj.h)
		obj.df = this.wdays[obj.d]
		obj.Df = this.format2Digit(obj.D)
		obj.Mf = this.months[obj.M]
		obj.Yf = obj.Y.toString()

		return obj
	}

	format2Digit(num) {
		return num < 10 ? `0${num}` : num.toString()
	}
}
