'use strict';

class FireworkCollection extends Map {
	filter(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		const results = new FireworkCollection();
		for (const [key, val] of this) if (fn(val, key, this)) results.set(key, val);
		return results;
	}

	map(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		const arr = [];
		for (const [key, val] of this) arr.push(fn(val, key, this));
		return arr;
	}
};

module.exports = FireworkCollection;
