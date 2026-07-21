# Contrato de contenido — Blog de Mario Colli

Cada archivo de `src/content/posts/` debe cumplir el schema de `src/content.config.ts`. El build falla ante un contrato inválido.

| Campo | Regla | Origen |
|---|---|---|
| `title` / `description` / `topic` / `tags` / `pubDate` | Texto editorial e índice | Transformador interno |
| `heroImage` / `readingTime` / `videoUrl` | Presentación pública opcional | Editor |
| `draft` | Indica muestra temporal; no se muestra al lector | Flujo interno |
| `caseId` / `sources` / `trustSummary` / `scriptStatus` | Campos operativos `internal: true`; ningún layout los renderiza | Flujo interno |

Una entrada definitiva procede de una decisión humana resuelta. El contrato no sustituye esa comprobación: el publicador debe rechazar material que no haya sido aprobado antes de crear el archivo.

Los enlaces a Instagram, TikTok, YouTube y Facebook se configuran con `PUBLIC_*_URL` y `PUBLIC_*_HANDLE`. Mientras no existan, las etiquetas visibles no enlazan a cuentas inventadas.
