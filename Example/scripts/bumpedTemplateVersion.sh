#!/bin/bash

# What this does:
# 1. Take the version of react, use the MAJOR.MINOR
#     - /nightly/ -> MAJOR.MINOR.PATCH-nightly-YYYYNN-HASH
#     - /-rc.N/   -> MAJOR.MINOR.PATCH-rc.N-HASH
#     - ELSE: continue
# 2. Look for the latest version of the template with that MAJOR.MINOR
#   - No version -> then set to MAJOR.MINOR.0
#   - MAJOR.MINOR.PATCH -> MAJOR.MINOR.PATCH+1

log() {
  echo "$@" >&2
}

if [[ $# != 1 ]]; then
  log "USAGE: bumpTemplateVersion.sh <react native version>"
  exit 1
fi

if [[ $1 =~ -rc\.[0-9]+ ]]; then
  log "Release candidate"
  # Append a sha, so if we need to re-release for a RC we don't conflict
  echo $1-$(git rev-parse --short HEAD)
  exit 0
fi

if [[ $1 =~ -nightly- ]]; then
  log "Nightly candidate"
  # Once a day, we're not going to get conflicts using the given nightly tag
  echo $1
  exit 0
fi

# Find current version of template that matches this version of react-native.
if [[ $1 =~ [0-9]+\.[0-9]+\.[0-9]+ ]]; then 
  MAJOR_MINOR=$(awk -F'.' '{ print $1"."$2 }' <<< $1)
  CURRENT_VERSION=$(npm show --json "@react-native-community/template@^$MAJOR_MINOR")
  if [ $? -ne 0 ]; then
    echo "$MAJOR_MINOR.0";
    exit 0;
  fi
  # Bump PATCH
  PUBLISHED=$(jq -r 'if . | type == "array" then last | .version else .version end' <<< $CURRENT_VERSION | awk -F'.' '{ print $1"."$2"."($3+1) }')
  echo $PUBLISHED;
  exit 0
fi

log "Unknown type of release: $RN_VERSION"
exit 1
