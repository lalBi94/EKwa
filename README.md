# EKwa - Traceur de courbe léger et portable

<img width="500" src="./img/1.png" />

## Introduction

À l'instar de [Desmos](https://www.desmos.com/calculator?lang=fr) ou [Géogebra](https://www.geogebra.org/classic?lang=fr), EKwa est un simple traceur de fonction écrit en [JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript), pouvant devenir un peu plus complexe en manipulant bien **JS**.

## Fonctionnalités

Il est possible de se balader dans le graphe généré par la fonction, choisir un intervalle, zoomer et choisir l'écart (discrétisation entre chaque `x` de `f(x)`). La fonctionnalité la plus intéressante est la saisie de fonction à l'aide des librairies natives de JavaScript `(Math.*)`.

## Fonctionnement

Le fonctionnement est le plus basique qui soit : un canvas qui dessine un carré sur un pixel de la page à l'aide de chaque valeur de `f(x)`.
Une contrainte pour les non-javascriptiens : les fonctions doivent obligatoirement être écrites en JavaScript. Pourquoi ce choix ? Afin d'uniformiser toutes les façons d'écrire une fonction, pouvoir visualiser et surtout, visualiser l'équivalent d'un code JavaScript (qui fait des boucles, etc.).
Un point important : les positions des points sont recalculées à chaque fois, ce qui peut être un peu embêutant niveau performance.
L'application est écrite en JavaScript natif, donc pour l'inclure dans un projet React, veuillez effectuer toutes les transformations nécessaires.

## Application

L'application est disponible sous différentes formes : sur le web (via gh-pages), en application pour un mode hors-ligne via [tauri](https://v2.tauri.app/fr/).

## Évolutions

Ce projet peut évoluer en différents points : améliorer l'interaction avec l'application pour un non-javascriptien, rendre l'application plus rapide parce que là, c'est un peu laborieux. Peut-être rajouter plus de design et ajouter plus de fonctionnalités telles que le téléchargement du graphe en plusieurs formats, etc. Pour finir, vous pouvez rendre le projet "compatible" avec Node.js. En effet, une bibliothèque intéressante, [Math.js](https://mathjs.org/docs/), permet de se libérer du JavaScript lors de l'écriture de la fonction. Il suffira juste de changer `scripts/utils.mjs` avec les implémentations nécessaires.

## Contributions & Fork

Le projet est sans licence, faites-en ce que vous voulez. Servez-vous-en tant que : template pour faire évoluer l'application, traceur de courbe personnalisé en modifiant le CSS, élément de visualisation de fonction pour un exposé ou autre.

## Utilisations & Exemples

### Cas Triviales

Nous pouvons faire de simples courbes telles que :

$$
f(x) = sin(x)+x^2
$$

ou en JavaScript :

```js
(x) => Math.sin(x) + Math.pow(x, 2);
```

<img width="500" src="./img/2.png"/>

ou bien cette fonction :

$$
f(x)={cos(x)}(\frac{tan(x)^2}{e^{sin(x)}})
$$

ou en JavaScript :

```js
Math.cos(x) * (Math.pow(Math.tan(x), 2) / Math.pow(Math.E, Math.sin(x)));
```

<img width="500" src="./img/3.png"/>

### Cas plus complexes

Dans l'introduction, je parlais d'une façon un peu plus complexe de construire des fonctions.
Dans le cas simple, nous sommes restreints à une seule fonction. Cela est dû au traitement interne de la transformation **string ↦ function** via `eval(string)`. En effet, l'application fait une concaténation :

```js
eval("(x) =>" + str);
// ou "str" est le retour d'une fonction sous forme de string. Ex : eval("(x) =>" + "Math.cos(x)") retournera cos(x).
```

On peut utiliser cette subtilité pour créer des sous-fonctions à n-paramètres telles que :

$$
g(j, k)=(\frac{sin(tan(j))}{log(k)})^{k}
$$

$$
f(x)=g(e^{x},x^{log(\frac{x}{x^{2}})})
$$

soit :

$$
f(x)=(\frac{sin(tan(e^{x}))}{log(x^{log(\frac{x}{x^{2}})})})^{x^{log(\frac{x}{x^{2}})}}
$$

en mettant ceci dans le champ de saisie de `f(x)`:

```js
((j, k) => Math.pow(Math.sin(Math.tan(j)) / Math.log(k), k))(
    Math.pow(Math.E, x),
    Math.pow(x, Math.log(x / Math.pow(x, 2)))
);
```

<img width="500" src="./img/4.png"/>

### Important à savoir

Comme dit plus haut, l'input texte est traduit via la fonction [eval](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/eval) de JavaScript. Elle est écrite simplement comme ceci :
```js
/**
 * Create function supportable by app
 * @param {string} str The function in string
 * @returns {function} Function associated
 */
export const composeFunction = (str) => {
    try {
        return eval("(x)=>" + str);
    } catch (err) {
        return null;
    }
};
```
Cette façon de faire prive simplement le `x` des noms de variables possibles à utiliser dans l'expression JavaScript. Ce qui nous offre des possibilités d'opération telles que les sommes.

Voici un exemple avec la somme des sinus cardinaux :

$$
Sn=\sum_{n=0}^{+\infty}{\frac{\sin(n)}{n}}
$$

traduit en JavaScript:
```js
((f, n) => {
    let acc = 0;
    for(let i = 0; i < n; ++i) acc += (f(i) || 0);
    return acc;
})(
    (n) => Math.sin(n)/n,
    x
)
```

<img width="500" src="./img/5.png"/>

Gardez juste en tête que le retour de la fonction que vous allez écrire dessinera un point aux coordonnées `{x, y}` où `x` correspond aux pas effectués et `y` au résultat de `f(x)`.