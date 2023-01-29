export function searchFunction(string, itemsToSearch) {
	return itemsToSearch.every((v) => string.includes(v));
}

export function occurrencesMultiples(arr, string) {
	return arr.reduce(function (accumulator, currentValue) {
		const occurrencesNumber = occurrences(string, currentValue);
		return accumulator + occurrencesNumber;
	}, 0);
}

/**
 * Fonction adaptée de : @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see https://stackoverflow.com/a/7924240/938822
 */
export function occurrences(string, subString) {
	string += "";
	subString += "";
	const l = subString.length;
	if (l <= 0) return string.length + 1;

	var n = 0,
		pos = 0;

	while (true) {
		pos = string.indexOf(subString, pos);
		if (pos >= 0) {
			++n;
			pos += l;
		} else break;
	}
	return n;
}
