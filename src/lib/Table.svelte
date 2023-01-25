<script>
	import {
		reorganizeData,
		reorganizeDataIfSmallScreen,
		reorganizeDataFunction,
		changeHeader,
		newHeader,
		historyColumnsClickDefault,
		dataNoHeader,
		tableCSS,
		desactivateRegexDefault,
		automaticSearch,
		scoreDisplay,
		textToSearchDefaultSmallScreen,
		textToSearchDefault,
		useAdditionalConditions,
		smallColumns,
		smallColumnsIfSmallScreen,
		activateFilters
	} from './config.js';
	import {
		searchFunction,
		occurrencesMultiples
	} from './searchFunctions.js';
	import MarkResults from './MarkResults.svelte';
	import AdditionalConditions from './AdditionalConditions.svelte';
	export let dataParsed;
	export let textToSearch;
	let dataTable;
	let search_items;
	let sortColumns = false;
	let historyColumnsClick = historyColumnsClickDefault;

	const innerWidth = window.innerWidth;

	let headers;
	let dataArray = Object.values(dataParsed);
	if (reorganizeData || (reorganizeDataIfSmallScreen && innerWidth <= 800)) {
		dataArray = reorganizeDataFunction(dataArray);
	}
	if (innerWidth <= 600) {
		textToSearch = textToSearchDefaultSmallScreen;
	}
	if (innerWidth > 600 && automaticSearch == true) {
		textToSearch = textToSearchDefault;
	}
	if (dataNoHeader == false) {
		headers = dataArray.shift();
		if (changeHeader) {
			headers = newHeader;
		}
	} else {
		headers = newHeader;
	}
	let headersLength = headers.length;
	let rows = dataArray;
	let pattern = '';
	let regex;
	let previoustextToSearch;
	let rowsFiltered = [];
	let rowsFilteredAndSorted = [];
	let filters = [];
	let baseFilterRegex = '++(?=';
	for (let index = 0; index < headersLength - 1; index++) {
		baseFilterRegex = baseFilterRegex + '.*\\t'
	}
	baseFilterRegex = baseFilterRegex + '.*)';
	let filter = '';

	function insertAt(initialString, stringToAdd, pos) {
		return initialString.substring(0, pos) + stringToAdd + initialString.substring(pos)
	}

	$: if (activateFilters == true && desactivateRegexDefault == false) {
		/* Si on arrive sur la page via un lien avec un hash, il faut remplir les filtres avec les informations du hash */
		let textFromTextToSearch = textToSearch;
		let hashFiltersArray = textFromTextToSearch.split('\+\+\(\?='); /* Les deux “+” sont nécessaires pour ne pas entrer en conflit avec d'éventuelles regex dans les conditions supplémentaires */
		let hashFiltersArrayFinal = Array(hashFiltersArray.length);
		hashFiltersArray.shift();
		if (textToSearch != textToSearchDefault && hashFiltersArray.length != 0) {
			hashFiltersArray.forEach(hashFiltersRaw => {
				let hashFiltersRawArray;
				if (hashFiltersRaw) {
					hashFiltersRawArray = hashFiltersRaw.split('.*\\t');
					hashFiltersRawArray.forEach((hash, index) => {
						if (hash != '') {
							hashFiltersArrayFinal[index] = hash
						}
					})
				}
			})
			if (filters.length == 0) {
				for (let index = 0; index < headersLength; index++) {
					if (hashFiltersArrayFinal[index] != '') {
						let hashFilter = hashFiltersArrayFinal[index];
						if (hashFilter) {
							hashFilter = hashFilter.replace('.*)', '').replace('.*', '');
							filters[index] = hashFilter;
						}
					}
				}
			}
		}
		if (filters.length != 0) {
			textToSearch = textToSearch.replace(/\+\+\(\?\=.*/g, '')
		}
		/* On ajoute à textToSearch une Regex qui force à chercher un élément à une position bien précise dans le tableau */
		for (let index = 0; index < headersLength; index++) {
			if (typeof (filters[index]) == 'string' && filters[index] != '') {
				filter = insertAt(baseFilterRegex, '.*' + filters[index], 1 + (4 * (index + 1)));
				textToSearch = textToSearch + filter;
			}
		}

		filter = '';
	}

	function sortColumnOnClick(i) {
		if (historyColumnsClick.includes(i)) {
			const index = historyColumnsClick.indexOf(i);
			historyColumnsClick.splice(index, 1);
			rows = rows.sort((a, b) => b[i].toString().localeCompare(a[i].toString(), "fr", {
				numeric: true
			}));
		} else {
			rows = rows.sort((a, b) => a[i].toString().localeCompare(b[i].toString(), "fr", {
				numeric: true
			}));
			historyColumnsClick.push(i);
		}
		sortColumns = true;
	}

	$: if (textToSearch !== '' && previoustextToSearch !== textToSearch) {
		pattern = '';
		search_items = textToSearch.toLowerCase().split("+");
		if (desactivateRegexDefault === false) {
			for (const search_item of search_items) {
				pattern = pattern + "(?=.*" + search_item + ")";
			}
			try {
				regex = new RegExp(pattern, 'i');
				rows = dataArray.filter((row) => row.join('\t').toLowerCase().match(regex));
				previoustextToSearch = textToSearch;
			} catch (e) {
				console.log("Invalid Regular Expression");
				textToSearch == '';
			}
		} else {
			setTimeout(function () {
				rows = dataArray;
				for (const row of rows) {
					const searchResults = searchFunction(row.join('\\t').toLowerCase(), search_items);
					if (searchResults) {
						rowsFiltered = [...rowsFiltered, row];
					}
				}
				if (scoreDisplay === true) {
					for (const row of rowsFiltered) {
						const score = occurrencesMultiples(search_items, row.join('\\t').toLowerCase());
						const rowN = [...row, score];
						rowsFilteredAndSorted = [...rowsFilteredAndSorted, rowN];
					}
					rowsFilteredAndSorted = rowsFilteredAndSorted.sort((a, b) => {
						return b[headersLength] -
							a[headersLength];
					})
					rows = rowsFilteredAndSorted;
				} else {
					rows = rowsFiltered;
				}
				/* rows = rowsFilteredAndSorted.map(function (val) {
					return val.slice(0, -1);
				}); */
				previoustextToSearch = textToSearch;
				rowsFiltered = [];
				rowsFilteredAndSorted = [];
			}, 5)
		}
	} else {
		if (textToSearch == '') {
			rows = dataArray;
		}
	}
</script>

{#if useAdditionalConditions == true && desactivateRegexDefault == false}
	<div class="additionalConditions">
		<AdditionalConditions bind:textToSearch/>
	</div>
{/if}

<table class:one-column="{headersLength===1}" class="{tableCSS}">
	{#if headers}	
		<thead>
			<tr>
				{#each headers as header, i}
					<th data-key="{header}" on:click={() => sortColumnOnClick(i)}>{@html header}</th>
				{/each}
				{#if scoreDisplay === true && automaticSearch === false}
					<th on:click={() => sortColumnOnClick(headersLength)}>Score</th>
				{/if}
			</tr>
			{#if innerWidth > 600 && activateFilters==true && desactivateRegexDefault==false && headersLength>1}
				<tr class="filters">
					{#each headers as header, i}
						<td><input type="text" id="filter-{i}" name="filter-{i}" bind:value={filters[i]} placeholder="filtre"></td>
					{/each}
				</tr>
			{/if}
		</thead>
	{/if}
	<tbody bind:this={dataTable}>
		{#if desactivateRegexDefault==true && textToSearch==''}
			<tr>
				<td colspan="{headersLength}" class="info-search">Utilisez l'outil de recherche ci-dessus : les résultats qui correspondent à la recherche s'afficheront ci-dessous</td>
			</tr>
		{:else}
			{#if previoustextToSearch != textToSearch && textToSearch!=''}
				<tr>
					<td colspan="{headersLength}">
						<p><span class="loader"></span></p>
						<p class="info-search">Recherche en cours</p>
					</td>
				</tr>
			{:else}
				{#if innerWidth <=600 && textToSearch==textToSearchDefaultSmallScreen && automaticSearch === true && textToSearchDefaultSmallScreen!=''}
					<tr>
						<td colspan="{headersLength}" class="info-search">Sur un petit écran, seule une partie des données s'affiche par défaut. Utilisez le moteur de recherche ci-dessus pour trouver ce qui vous intéresse, ou cliquez sur : <button on:click={()=>textToSearch=''}>Voir toutes les données</button></td>
					</tr>
				{/if}
				{#if innerWidth>600 && automaticSearch === true && textToSearch==textToSearchDefault && textToSearchDefault!=''}
					<tr>
						<td colspan="{headersLength}" class="info-search"><strong>Par défaut, seule une partie des données s'affiche.</strong><br />Utilisez le moteur de recherche ci-dessus pour trouver ce qui vous intéresse. <br>Ou cliquez sur : <button on:click={()=>textToSearch=''}>Voir toutes les données</button></td>
					</tr>
				{/if}
				{#if rows.length !=0}
					{#each rows as row}
						<tr>
							{#each row as cell,i}
								<td class:small="{innerWidth<=600 ? smallColumnsIfSmallScreen.includes(i+1) : smallColumns.includes(i+1)}">{@html cell}</td>
							{/each}
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="{headersLength}" class="info-search">Aucun résultat trouvé</td>
					</tr>
				{/if}
			{/if}
		{/if}
	</tbody>
</table>

<MarkResults {dataTable} {textToSearch} bind:sortColumns/>

<style>
	table {
		text-align: justify;
		border-collapse: separate;
		border-spacing: 0;
		border: 2px solid #6a0012;
		margin: 3em auto;
		border-radius: .25rem;
		table-layout: auto;
		width: 95%;
		max-width: 1200px;
		line-height: 1.6em;
	}

	th {
		cursor: pointer;
		font-weight: 600;
	}

	th:after {
		content: "↕";
		font-size: 0.7em;
		position: relative;
		left: 5px;
		top: -2px;
	}

	thead tr:first-child {
		background: #6a0012;
		color: #fff;
		border: none;
	}

	th:first-child,
	td:first-child {
		padding: 0 15px 0 20px;
	}

	thead tr {
		height: 2em;
	}

	tbody tr:first-child td {
		padding-top: 10px;
	}

	tbody td {
		border-bottom: 1px solid #ddd;
		padding-bottom: 10px;
		padding-top: 10px;
	}

	tbody tr:hover {
		background-color: #f2f2f2;
	}

	th:last-child,
	td:last-child {
		padding-right: 30px;
	}

	th,
	td {
		padding-left: 1vw;
		padding-right: 1vw;
	}

	.one-column td,
	.one-column th {
		text-align: center;
		padding-left: 5vw;
		padding-right: 5vw;
	}

	td.small {
		font-size: 0.9em;
	}

	table.small {
		max-width: 800px !important;
	}

	.info-search {
		text-align: center;
		padding: 2em !important;
	}

	.additionalConditions {
		max-width: 960px;
		margin: auto;
		width: 80%;
		text-align: center;
		font-size: 0.9em;
		margin-bottom: 3em;
	}

	.filters{
		font-size:0.7em;
		height:0.7em
	}

	td input {
		border: 1px solid #DDD;
		color: #333;
	}
	td input::placeholder {
		color:#666;
	}

	@media screen and (max-width:600px) {
		table {
			font-size: 0.9em;
		}
	}
</style>