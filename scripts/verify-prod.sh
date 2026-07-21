#!/usr/bin/env bash
set -euo pipefail

# This verifier is deliberately independent from the build: it proves that the
# Vercel production deployment for the repository and the bytes at the public
# URL both correspond to the commit being released.
base_url="${1:-https://athena-blog-one.vercel.app}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
expected_commit="${EXPECTED_COMMIT_SHA:-$(git -C "$repo_root" rev-parse HEAD)}"
expected_commit="$(printf '%s' "$expected_commit" | tr '[:upper:]' '[:lower:]')"
github_repo="${GITHUB_REPOSITORY:-shoctroper/AthenaBlog}"
max_attempts="${VERCEL_WAIT_ATTEMPTS:-18}"

command -v gh >/dev/null || { echo "gh is required to verify the Vercel production commit." >&2; exit 2; }

validate_xml() {
  if command -v xmllint >/dev/null; then
    xmllint --noout -
  else
    # GitHub's runner image does not guarantee xmllint. Python's standard
    # library keeps this release gate dependency-free.
    python3 -c 'import sys, xml.etree.ElementTree as ET; ET.parse(sys.stdin)'
  fi
}

# Vercel creates this GitHub Deployment record only after assigning a
# Production deployment. It is the deployment-side commit authority, while
# the curl checks below prove that the production alias serves the release.
deployed_commit=""
for attempt in $(seq 1 "$max_attempts"); do
  deployed_commit="$(gh api "repos/$github_repo/deployments?per_page=20" --jq '[.[] | select(.environment == "Production" and .creator.login == "vercel[bot]")][0].sha // empty')"
  deployed_commit="$(printf '%s' "$deployed_commit" | tr '[:upper:]' '[:lower:]')"
  vercel_state="$(gh api "repos/$github_repo/commits/$expected_commit/status" --jq '[.statuses[] | select(.context == "Vercel")][0].state // empty')"
  if [[ "$deployed_commit" == "$expected_commit" && "$vercel_state" == "success" ]]; then
    break
  fi
  if [[ "$attempt" == "$max_attempts" ]]; then
    echo "Production commit mismatch after waiting: Vercel=$deployed_commit status=${vercel_state:-missing} HEAD=$expected_commit" >&2
    exit 1
  fi
  echo "Waiting for Vercel Production deployment ($attempt/$max_attempts): commit=${deployed_commit:-missing} status=${vercel_state:-missing}"
  sleep 10
done
echo "OK deployed commit $deployed_commit matches HEAD"

# These are internal-pipeline labels, not ordinary editorial vocabulary.  In
# particular, "IA" is intentionally allowed: it is a legitimate topic.
forbidden='\b(athena|guion|caso|aprobado|contenido[[:space:]-]+generad|publicaci[oó]n[[:space:]-]+automatiz)\b'
urls=("/" "/videos/" "/sobre-mi/" "/contacto/" "/posts/case-c-internet/" "/posts/case-e5-sleep/")
for path in "${urls[@]}"; do
  html="$(curl --fail --silent --show-error "$base_url$path")"
  # The production hostname itself contains "athena"; it is infrastructure,
  # not a leaked editorial/internal label.
  visible_check="$(printf '%s' "$html" | sed "s#${base_url}##g")"
  if printf '%s' "$visible_check" | rg -i "$forbidden" >/dev/null; then
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
printf '%s' "$canonical" | rg -F "<link rel=\"canonical\" href=\"$base_url/\"" >/dev/null

curl --fail --silent --show-error "$base_url/rss.xml" | validate_xml
curl --fail --silent --show-error "$base_url/sitemap-index.xml" | validate_xml
echo "OK production canonical/RSS/sitemap"
