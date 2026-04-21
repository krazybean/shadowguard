#!/usr/bin/env bash

set -e

# Ensure version type is provided
if [ -z "$1" ]; then
  echo "Usage: ./release.sh [patch|minor|major]"
  exit 1
fi

VERSION_TYPE=$1

if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Invalid version type: $VERSION_TYPE"
  echo "Use one of: patch, minor, major"
  exit 1
fi

echo "Releasing new $VERSION_TYPE version..."

# Ensure working directory is clean
if [[ -n $(git status --porcelain) ]]; then
  echo "Git working directory is not clean. Commit or stash changes first."
  exit 1
fi

# Install deps (optional but safe)
echo "Installing dependencies..."
npm install

# Run tests
echo "Running tests..."
npm test

# Build project
echo "Building project..."
npm run build

# Bump version (this commits + tags)
echo "Bumping version ($VERSION_TYPE)..."
npm version "$VERSION_TYPE"

# Push commits and tags
echo "Pushing to git..."
git push origin main --follow-tags

# Publish to npm
echo "Publishing to npm..."
npm publish --access public

echo "Release complete!"
