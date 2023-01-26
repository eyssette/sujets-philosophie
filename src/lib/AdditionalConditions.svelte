<script>
	import {
		additionalConditionsArray
	} from './config.js';
	import {
		onMount
	} from 'svelte';
	export let textToSearch;
	let conditionsHash;
	let conditionsHashString;
	let conditionsHashArray = [];
	let conditionChecked = [];
	let baseURL;
	let hash;
	let conditionsHashStringURL = '';
	let regexCondition;

	onMount(() => {
		baseURL = window.location.origin + window.location.pathname;
	})

	function copyURL() {
		hash = textToSearch;
		regexCondition = '';
		conditionsHashStringURL = ''
		additionalConditionsArray.forEach(
			(condition, index) => {
				regexCondition = condition[1];
				regexCondition = regexCondition.replace('\\\\', '\\');
				hash = hash.replaceAll(regexCondition, '');
				if (conditionChecked[index] == true) {
					conditionsHashStringURL = conditionsHashStringURL + 'C' + (index += 1);
				}
			}
		)
		if (conditionsHashStringURL != '') {
			conditionsHashStringURL = '&' + conditionsHashStringURL;
		}
		navigator.clipboard.writeText(baseURL + '#' + hash + conditionsHashStringURL);
	}

	$: {
		conditionsHash = textToSearch.split('&');
		textToSearch = conditionsHash[0];
		conditionsHash.shift();
		conditionsHashString = conditionsHash[0];
		if (conditionsHashString) {
			conditionsHashArray = conditionsHashString.split('C').map(v => parseInt(v));
		} else {
			conditionsHashArray = [];
		}
		additionalConditionsArray.forEach(
			(condition, index) => {
				if (conditionChecked[index] == true || conditionsHashArray.includes(index + 1)) {
					conditionChecked[index] = true;
					if(!textToSearch.includes(condition[1])) {
						textToSearch = textToSearch + condition[1];
					}
				} else {
					textToSearch = textToSearch.replace(condition[1], '');
				}
			}
		)
	}
</script>

{#each additionalConditionsArray as condition,i}
	<p><label for="condition-{i}">{condition[0]} </label> :
	<input type="checkbox" id="condition-{i}" name="condition-{i}" bind:checked={ conditionChecked[i]}></p>
{/each}

<div class="share-search-URL">Copier le lien : <button on:click={copyURL}>🔗</button></div>

<style>
	p {
		margin: 0
	}

	.share-search-URL {
		float: right;
		font-size: 1em;
		right: 10px;
	}
</style>