<script>
	import { markText } from "./config.js";
	import Mark from "mark.js";
	export let dataTable;
	export let textToSearch;
	export let sortColumns;
	let markInstance;
	let search_items;

	const regexSplit = new RegExp(/\+|\|/);

	function markMatches(text) {
		if (markInstance) {
			markInstance.unmark();
		}
		if (text != "") {
			markInstance = new Mark(dataTable);
			try {
				search_items = text.split("(")[0].split(regexSplit);
			} catch (e) {
				console.log("Invalid Regular Expression");
				search_items = text.split("(")[0].split("+");
			}
			search_items.forEach((search_item, index) => {
				search_item = search_item.replaceAll(".*", "");
				search_item.split("\\t").forEach((item) => {
					markInstance.mark(
						item
							.replaceAll("^", "")
							.replaceAll(".?", "?")
							.replaceAll(".*", "*"),
						{
							element: "span",
							className: "match" + (index + 1),
							accuracy: "complementary",
							separateWordSearch: false,
							wildcards: "enabled",
						}
					);
				});
			});
		}
	}

	$: {
		if (markText) {
			setTimeout(function () {
				markMatches(textToSearch);
			}, 10);
		}
	}

	$: if (sortColumns == true) {
		if (markText) {
			setTimeout(function () {
				markMatches(textToSearch);
			}, 10);
		}
		sortColumns = false;
	}
</script>

<style>
	:global(.match1) {
		background: hsl(53, 100%, 88%);
	}

	:global(.match2) {
		background: hsl(197, 71%, 92%);
	}

	:global(.match3) {
		background: hsl(150, 86%, 92%);
	}

	:global(.match4),
	:global(.match5),
	:global(.match6) {
		background: hsl(256, 85%, 93%);
	}
</style>
