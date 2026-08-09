#!/usr/bin/env bash
set -euo pipefail

# This verifier checks the public bytes directly. Commit/deployment comparison
# is optional because a production-content audit must not depend on GitHub.
base_url="${1:-https://athena-blog-one.vercel.app}"

validate_xml() {
  if command -v xmllint >/dev/null; then
    xmllint --noout -
  else
    # GitHub's runner image does not guarantee xmllint. Python's standard
    # library keeps this release gate dependency-free.
    python3 -c 'import sys, xml.etree.ElementTree as ET; ET.parse(sys.stdin)'
  fi
}

# These are internal-pipeline labels, not ordinary editorial vocabulary.  In
# particular, "IA" is intentionally allowed: it is a legitimate topic.
forbidden='\b(athena|guion|caso|aprobado|contenido[[:space:]-]+generad|publicaci[oó]n[[:space:]-]+automatiz)\b'
urls=("/" "/videos/" "/sobre-mi/" "/contacto/" "/posts/case-c-internet/" "/posts/case-e5-sleep/")
for path in "${urls[@]}"; do
  html="$(curl --fail --silent --show-error "$base_url$path")"
  # The production hostname itself contains "athena"; it is infrastructure,
  # not a leaked editorial/internal label.
  visible_check="$(printf '%s' "$html" | sed "s#${base_url}##g")"
  if printf '%s' "$visible_check" | grep -Eqi "$forbidden"; then
    echo "Prohibited public string at $path" >&2
    exit 1
  fi
  echo "OK $path"
done

not_found_status="$(curl --silent --output /dev/null --write-out '%{http_code}' "$base_url/no-debe-existir")"
[[ "$not_found_status" == "404" ]] || { echo "Expected a 404 for an unknown route, got $not_found_status" >&2; exit 1; }
echo "OK unknown route returns 404"

# Keep the command output visible in CI and in release reports: it is the
# minimum evidence that the production alias, rather than localhost or a
# preview URL, was checked.
canonical="$(curl -s "$base_url/" | grep canonical)"
printf '%s\n' "$canonical"
printf '%s' "$canonical" | grep -F "<link rel=\"canonical\" href=\"$base_url/\"" >/dev/null

curl --fail --silent --show-error "$base_url/rss.xml" | validate_xml
curl --fail --silent --show-error "$base_url/sitemap-index.xml" | validate_xml
echo "OK production canonical/RSS/sitemap"
