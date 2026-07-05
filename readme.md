# unplugin-plugin-userscript

Available plugins:

- `userscript-inject-code` - Injects code fragment into compiled userscript
- `userscript-metadata` - Injects metadata comments
- `userscript-proxy` - Generates proxy scripts to bypass browser cache

## Usage

As a single plugin:

```ts
import { userscript } from "unplugin-plugin-userscript/rolldown"

build({
  plugins: [
    userscript({
      // ...
    })
  ]
})
```

As separate plugins:

```ts
import { metadata } from "unplugin-plugin-userscript/rolldown"

build({
  plugins: [
    metadata({
      // ...
    })
  ]
})
```
