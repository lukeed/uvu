import diff from 'diff';
import kleur from 'kleur';

const colors = {
	'--': kleur.red,
	'··': kleur.grey,
	'++': kleur.green,
};

const TITLE = kleur.dim().italic;
const LINE = num => kleur.dim('L' + num + ' ');
const TAB = kleur.dim('→'), SPACE = kleur.dim('·');
const PRETTY = str => str.replace(/[ ]/g, SPACE).replace(/\t/g, TAB);
const PRINT = (sym, str, len) => colors[sym](sym + str + ' '.repeat(4 + len) + TITLE(sym == '++' ? '(Expected)\n' : '(Actual)\n'));

function line(obj, prev) {
	let char = obj.removed ? '--' : obj.added ? '++' : '··';
	let i=0, tmp, arr = obj.value.split('\n');
	let out='', fmt = colors[char];

	if (obj.added) out += fmt().underline(TITLE('Expected:')) + '\n';
	else if (obj.removed) out += fmt().underline(TITLE('Actual:')) + '\n';

	for (; i < arr.length; i++) {
		if (tmp = arr[i]) {
			if (prev) out += LINE(prev + i);
			out += fmt(char + PRETTY(tmp)) + '\n';
		}
	}

	return out;
}

export function arrays(input, expect) {
	let arr = diff.diffArrays(input, expect);
}

export function lines(input, expect, linenum = 0) {
	let i=0, tmp, output='';
	let arr = diff.diffLines(input, expect);

	for (; i < arr.length; i++) {
		output += line(tmp = arr[i], linenum);
		if (linenum && !tmp.removed) linenum += tmp.count;
	}

	return output;
}

export function chars(input, expect) {
	let arr = diff.diffChars(input, expect);
	let i=0, output='', tmp = arr[i];

	let l1 = input.length;
	let l2 = expect.length;

	let p1 = PRETTY(input);
	let p2 = PRETTY(expect);

	// TODO: debug this
	if (tmp.removed) {
		p2 = ' '.repeat(tmp.count) + p2;
		l2 += tmp.count;
	} else if (tmp.added) {
		p1 = ' '.repeat(tmp.count) + p1;
		l1 += tmp.count;
	}

	let l3 = Math.max(l1, l2);
	output += direct(p1, p2, l1, l2);

	if (l1 === l2) {
		for (tmp='  '; i < l1; i++) {
			tmp += p1[i] === p2[i] ? ' ' : '^';
		}
	} else {
		for (tmp='  '; i < arr.length; i++) {
			// TODO: debug this
			// tmp += ((arr[i].added || arr[i].removed) ? '^' : ' ').repeat(arr[i].count);
			tmp += ((arr[i].added || arr[i].removed) ? '^' : ' ').repeat(Math.max(arr[i].count, 0));
			if (i + 1 < arr.length && ((arr[i].added && arr[i+1].removed) || (arr[i].removed && arr[i+1].added))) {
				arr[i + 1].count -= arr[i].count;
			}
		}
		while (i++ < l3) tmp += ' ';
	}

	return output + kleur.red(tmp);
}

export function direct(input, expect, lenA = String(input).length, lenB = String(expect).length) {
	let lenC = Math.max(lenA, lenB);
	return PRINT('++', expect, lenC - lenB) + PRINT('--', input, lenC - lenA);
}

export function compare(input, expect) {
	if (Array.isArray(expect)) return arrays(input, expect);
	if (expect instanceof RegExp) return chars(''+input, ''+expect);

	if (expect && typeof expect == 'object') {
		input = JSON.stringify(input, null, 2);
		expect = JSON.stringify(expect, null, 2);
	}

	if (String(expect).includes('\n')) {
		return lines(input, expect);
	}

	if (typeof expect == 'string') {
		return chars(input, expect);
	}

	return direct(input, expect);
}
