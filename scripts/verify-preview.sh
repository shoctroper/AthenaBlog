#!/usr/bin/env bash
set -euo pipefail

# Verifica un deployment Preview sin confundirlo con producción. No consulta ni altera Vercel.
base_url="${1:?Uso: verify-preview.sh https://preview.example.vercel.app}"
base_url="${base_url%/}"

for path in / /videos/ /sobre-mi/ /contacto/ /posts/case-c-internet/; do
  html="$(curl --fail --silent --show-error "$base_url$path")"
  printf '%s' "$html" | grep -F 'property="og:image"' >/dev/null
  printf '%s' "$html" | grep -E 'social/.+\.png' >/dev/null
  echo "OK preview $path"
done

status="$(curl --silent --output /dev/null --write-out '%{http_code}' "$base_url/no-debe-existir")"
[[ "$status" == "404" ]] || { echo "Preview debe responder 404 a una ruta desconocida; recibió $status" >&2; exit 1; }
echo "OK preview: rutas, OpenGraph PNG y 404 verificados"
