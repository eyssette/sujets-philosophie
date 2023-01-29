export const title = "Rechercher un sujet de dissertation en philosophie";

export const src = [
	"https://raw.githubusercontent.com/eyssette/sujets-philosophie/main/data/sujets-vrac.tsv",
];

export const contentAfterTable =
	'Site créé par <a href="http://eyssette.github.io/">Cédric Eyssette</a> à partir du travail de <a href="http://baptiste.meles.free.fr/">Baptiste Méliès</a> (pour les sujets de concours), de l\'<a href="http://www.ac-grenoble.fr/PhiloSophie/3000-sujets-de-dissertation-en-ligne/">académie de Grenoble</a> (pour les sujets de bac avant 1996), de <a href="http://bdbac.admin.free.fr/index.html">BD Bac</a> et de <a href="https://philo-labo.fr/sujets/">François Elie</a> (pour les sujets de bac après 1996), de <a href="http://aclyon-philosophie.fr/?page_id=459">l\'académie de Lyon</a>, de <a href="https://philo52.com/">Philo52</a> (Pierre-Jean Haution), des annales du <a href="https://concoursgeneral.org/sujets/">concours général de philosophie</a>, des annales d\'autres concours, et de divers sujets glanés sur le web';

/* Si la base de données est trop importante, il faut que la recherche ne se déclenche pas automatiquement, mais seulement en appuyant sur Entrée, et il faut désactiver l'utilisation d'une regex. On peut également choisir de calculer un score de pertinence ou non. */
export const automaticSearch = true;
export const desactivateRegexDefault = false;
export const scoreDisplay = false;

export const activateFilters = false;

export const textToSearchDefaultSmallScreen = "liberté+conscience";
export const textToSearchDefault = "liberté+conscience";

/* Pour réorganiser les données (notamment pour faire une version différente sur mobile) */
export const reorganizeData = false;
export const reorganizeDataIfSmallScreen = false;
export function reorganizeDataFunction(arrInit) {
	/* Un exemple qui ne garde que certaines colonnes */
	return arrInit.map((element) => [element[0], element[1], element[4]]);
	/* Un exemple de regroupement */
	/* return arrInit.map(element => [element[0],  element[2] + '<br/>' + element[1] + (element[3] ? element[3] : '')]);  */
}

/* Pour changer le titre des colonnes  */
export const dataNoHeader = true;
export const changeHeader = true;
export const newHeader = ["Intitulé du sujet"];

/* Pour que certaines colonnes s'affichent en plus petit */
export const smallColumns = [];
export const smallColumnsIfSmallScreen = [];

/* Surligner les mots recherchés */
export const markText = true;

/* Si les données sont déjà triées en ordre ascendant pour une colonne, il faut l'indiquer ici, en notant les numéros des colonnes concernées */
export let historyColumnsClickDefault = [0];

export const tableCSS = "small";
/* export let tableCSS='small' */

/* Pour indiquer des conditions supplémentaires possibles (cases à cocher) avec le format suivant : intitulé de la condition, regex correspondante. Les conditions supplémentaires ne sont possibles que si desactivateRegexDefault = false */
export const useAdditionalConditions = true;
export const additionalConditionsArray = [
	["Seulement des sujets avec une question", "(?=.*\\?$)"],
	["Seulement des sujets sans question", "(?=.*([A-zÀ-ÿ]|»|\\)|[0-9]|!|>)$)"],
];
