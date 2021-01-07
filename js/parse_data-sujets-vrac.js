var rows;
var title;
var content;
var table_start;
var table_end;
var table_content;
var table_header;
var table_body;
table_start = "<table>";
table_header = "<thead><tr><th>Intitulé du sujet</th></tr></thead>";
table_end = "</table>";
Papa.parse("https://raw.githubusercontent.com/eyssette/sujets-philosophie/main/data/sujets-vrac.tsv", {
	download: true,
	header: false,
	delimiter: "    ",
	complete: function(results) {
		rows = results.data;
		rows = rows.splice(1, rows.length);
		table_body = "<tbody>";
		rows.forEach((element) => {
			recherche = document.getElementById("recherche_dans_le_sujet").value;
			table_body = table_body + "<tr>";
			cell = element[0];
			table_body = table_body + "<td>" + cell + "</td>";
			table_body = table_body + "</tr>";
		});
		table_body = table_body + "</tbody>";
		content = table_start + table_header + table_body + table_end;
		document.getElementById("content").innerHTML = content;
	}
});
var input = document.getElementById("recherche_dans_le_sujet")
input.oninput = handleInput;
var case_avec_question = document.getElementById("sujets_avec_question")
var case_sans_question = document.getElementById("sujets_sans_question")
case_avec_question.addEventListener('click',handleInput);
case_sans_question.addEventListener('click',handleInput);

function handleInput(e) {
	var search = input.value;
	if(this.timer) {
		window.clearTimeout(this.timer);
	}
	this.timer = window.setTimeout(function() {
		search_items = search.split("+");
		pattern = "";
		search_items.forEach((search_item) => {
			pattern = pattern + "(?=.*" + search_item + ")";
		});
		if(case_avec_question.checked) {
			pattern = pattern + '(?=.*\\?$)';
		}
		if(case_sans_question.checked) {
			pattern = pattern + '(?=.*(?<!\\?)$)';
		}
		regex = new RegExp(pattern, 'i');
		table_body = "<tbody>";
		rows.forEach((element) => {
			cell = element[0];
			if(cell.toString().match(regex)) {
				table_body = table_body + "<tr>";
				table_body = table_body + "<td>" + cell + "</td>";
				table_body = table_body + "</tr>";
			}
		});
		table_body = table_body + "</tbody>";
		content = table_start + table_header + table_body + table_end;
		document.getElementById("content").innerHTML = content;
	}, 200);
}

function delay(fn, ms) {
	let timer = 0
	return function(...args) {
		clearTimeout(timer)
		timer = setTimeout(fn.bind(this, ...args), ms || 0)
	}
}
