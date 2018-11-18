# CookieTouch API Documentation
[Summary](SUMMARY.md) | [Single page summary](singlepage.md)

<hr>

## Table of Contents
- [Craft](#craft)
  - [craft](#craft)

# Craft
All functions related to crafts

<h2 id="newCraft">craft(<code>uid</code>: <a href="https://developer.mozilla.org/fr-Fr/docs/Web/JavaScript/Data_structures#Number_type">number</a>, <code>qty</code>: <a href="https://developer.mozilla.org/fr-Fr/docs/Web/JavaScript/Data_structures#Number_type">number</a>)</h2>

Craft an amount of an item.

**Exemple:**
```js
async function* craftitem() {
  yield * (await useById(400)); // Use the oven with the action (bake bread in this case(-1))
  yield* await craft.craft(468, 10) // Craft 10 Amaknian Bread ( 468 = Amaknian Bread )
}
```

**All GID are available in [items.txt](https://github.com/yovanoc/cookietouch/blob/master/resources/identifiants/items.txt).**


