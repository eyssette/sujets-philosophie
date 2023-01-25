<script>
	import {
		automaticSearch,
		useAdditionalConditions,
		desactivateRegexDefault
	} from './config.js';
	import {
		onMount
	} from 'svelte';
	export let textToSearch = '';

	let hash;
	let inputValue = '';
	let baseURL;


	onMount(() => {
		baseURL = window.location.origin + window.location.pathname;
		hash = window.location.hash;
		if (hash) {
			inputValue = decodeURI(hash.slice(1).split('&')[0].replace(/\+\+\(\?=.*/,''));
			textToSearch = decodeURI(hash.slice(1));
		}
	});

	function searchDatabase() {
		if (automaticSearch == true && desactivateRegexDefault == true) {
			if (inputValue.length > 2) {
				setTimeout(() => {
					textToSearch = inputValue;
				}, 300);
			} else {
				textToSearch = '';
			}
		} else {
			textToSearch = inputValue;
		}
	}

	function copyURL() {
		navigator.clipboard.writeText(baseURL + '#' + inputValue);
	}
</script>

<label for="search">Votre recherche :</label>
{#if automaticSearch == true}
	<input type="text" id="search" name="search" bind:value={inputValue} on:input={searchDatabase}>
{:else}
	<input type="text" id="search" name="search" bind:value={inputValue} on:change={searchDatabase}>
{/if}

<div class="search-explanations"><em>Astuce 1 : </em>ne mettre que le début d'un terme que l'on recherche pour pouvoir trouver tous les mots dérivés (p.ex. : “lib” pour “liberté”, “libération”, “libérer”, “libre”). <em>Astuce 2 :</em> utiliser “terme1+terme2” pour imposer la présence des deux termes. {#if automaticSearch == true}<em>Astuce 3 :</em> on peut utiliser des regex (p.ex. “parler|parole”){/if}
</div>

{#if useAdditionalConditions==false}
	<div class="share-search-URL">Copier le lien : <button on:click={copyURL}>🔗</button></div>
{/if}


<style>
	label {
		font-size: 1.1em;
	}

	.share-search-URL {
		float: right;
		font-size: 1em;
		right: 10px;
	}

	.search-explanations {
		max-width: 800px;
		margin: auto;
		padding-top: 1em;
		padding-bottom: 1em;
		text-align: justify;
	}
</style>