#!/usr/bin/env bash
# This script is not currently run on TeamCity. The plan is to add
# this script now (which replicates the current TeamCity behaviour)
# and once it has been merged into all branches for a bit, update
# the TeamCity build steps to just run this script.

set -x
./scripts/clear-docker.sh
set -e
./scripts/make-build-env.sh
./scripts/run-dependencies.sh
./scripts/add-test-accounts-for-integration-tests.sh
./scripts/run-build.sh /home/aehill/.docker/config.json
./scripts/make-integration-tests-image.sh
