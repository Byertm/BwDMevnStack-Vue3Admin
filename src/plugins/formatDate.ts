export const formatDate = {
	join(t: Date, a: Array<any>, s: string) {
		function format(m: any) {
			let f = new Intl.DateTimeFormat('en', m);
			return f.format(t);
		}
		return a.map(format).join(s);
	},
	format(dateString: string) {
		if (!!dateString) {
			const date = new Date(dateString);
			// Then specify how you want your dates to be formatted

			return new Intl.DateTimeFormat('tr', { dateStyle: 'long' }).format(date);

			const d = new Date(dateString);
			let datestring = `${('0' + d.getDate()).slice(-2)}-${('0' + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()} ${('0' + d.getHours()).slice(-2)}:${(
				'0' + d.getMinutes()
			).slice(-2)}`;
			return datestring;
		}
		return 'Not format';
	},
	format2(dateString: string) {
		if (!!dateString) {
			const d = new Date(dateString);
			let datestring = `${('0' + d.getDate()).slice(-2)}-${('0' + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()} ${('0' + d.getHours()).slice(-2)}:${(
				'0' + d.getMinutes()
			).slice(-2)}`;
			return datestring;
		}
		return 'Not format';
	},
	formatFK(dateString: string) {
		if (!!dateString) {
			return this.join(new Date(dateString), [{ year: 'numeric' }, { month: '2-digit' }, { day: '2-digit' }], '-');
		}
		return '';
	}
};

export default formatDate;