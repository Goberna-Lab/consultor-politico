# consultor-politico

Landing del Diploma Internacional del Consultor Político. Arquitectura modular,
**1 carpeta = 1 sección** (HTML + CSS + JS), sin framework.

```
base/        chrome compartido: head/nav/footer/modal/tail .html + base/nav/wsp/footer/modal .css
sections/<seccion>/   <seccion>.html · <seccion>.css · <seccion>.js (si tiene interacción)
js/core.js   config (Bravo/Sheets) · countdown · nav · modal · form · whatsapp
build.mjs    arma index.html concatenando los parciales (build.manifest.json)
index.html   GENERADO — no editar a mano
```

## Build

El `index.html` se **genera** desde los parciales. Tras editar cualquier `*.html`:

```bash
node build.mjs
```

Editás `sections/<seccion>/<seccion>.html` (o `base/*.html`), corrés `node build.mjs`
y se regenera `index.html`. El deploy (rsync/zip) sigue sirviendo ese `index.html` — sin build en el server.

Para reordenar/agregar/quitar secciones: editá `build.manifest.json`.
