<script>
	import Papa from "papaparse";
	import Table from "../lib/Table.svelte";
	import Search from "../lib/Search.svelte";
	import {
		title,
		src,
		dataNoHeader,
		contentAfterTable,
	} from "../lib/config.js";
	let textToSearch = "";
	let parsedData = [];
	let promises = [];

	for (const url of src) {
		promises.push(fetch(url));
	}

	async function fetchCsv() {
		const responses = await Promise.all(promises);
		const data = await Promise.all(
			responses.map((response) => response.text())
		);
		let headers;
		for (const csvData of data) {
			const parse = Papa.parse(csvData, {
				delimiter: "\t",
				fastMode: true,
				comments: "# ",
			}).data;
			dataNoHeader ? (headers = []) : (headers = parse.shift());
			parsedData = [...parsedData, ...parse];
		}
		parsedData.unshift(headers);
		return parsedData;
	}

	const dataParsed = fetchCsv();
</script>

<h1>{title}</h1>

{#await dataParsed}
	<p><span class="loader" /></p>
	<p>Chargement des données. Merci de patienter.</p>
{:then dataParsed}
	<div class="search">
		<p>{dataParsed.length} sujets dans la base</p>
		<Search bind:textToSearch />
	</div>
	<Table {dataParsed} bind:textToSearch />
	<footer class="contentAfterTable">{@html contentAfterTable}</footer>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			"Helvetica Neue", Arial, sans-serif;
		color: #333;
	}

	h1,
	p {
		text-align: center;
		margin-top: 1em;
	}

	.search,
	footer {
		max-width: 960px;
		margin: auto;
		width: 80%;
		text-align: center;
		font-size: 0.9em;
	}

	footer {
		text-align: justify;
		font-size: 1em;
		margin-bottom: 3em;
		max-width: 800px !important;
	}

	:global(.loader) {
		border: 16px solid #f3f3f3;
		border-top: 16px solid #3498db;
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
		display: block;
		text-align: center !important;
		padding: 20px;
		margin: 3em auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
