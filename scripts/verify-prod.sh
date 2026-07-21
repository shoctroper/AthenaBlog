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

command -v gh >/dev/null || { echo "gh is required to verify the Vercel production commit." >&2; exit 2; }
command -v xmllint >/dev/null || { echo "xmllint is required to verify XML output." >&2; exit 2; }

# Vercel creates this GitHub Deployment record only after assigning a
# Production deployment. It is the deployment-side commit authority, while
# the curl checks below prove that the production alias serves the release.
deployed_commit="$(gh api "repos/$github_repo/deployments?per_page=20" --jq '[.[] | select(.environment == "Production" and .creator.login == "vercel[bot]")][0].sha // empty')"
deployed_commit="$(printf '%s' "$deployed_commit" | tr '[:upper:]' '[:lower:]')"
if [[ -z "$deployed_commit" ]]; then
  echo "No Vercel Production deployment was found for $github_repo." >&2
  exit 1
fi
if [[ "$deployed_commit" != "$expected_commit" ]]; then
  echo "Production commit mismatch: Vercel=$deployed_commit HEAD=$expected_commit" >&2
  exit 1
fi
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

curl --fail --silent --show-error "$base_url/rss.xml" | xmllint --noout -
curl --fail --silent --show-error "$base_url/sitemap-index.xml" | xmllint --noout -
echo "OK production canonical/RSS/sitemap"
