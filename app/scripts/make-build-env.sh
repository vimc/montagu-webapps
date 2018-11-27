#!/usr/bin/env bash
set -ex
git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)

# Shared build env between the main build (being executed now) and the 
# reusable integration test image that will be run in the main Montagu build.
docker build --no-cache -f ./docker/shared-build-env.dockerfile \
    -t montagu-portal-shared-build-env \
    .

# The main build env which builds and tests in the next step
docker build -f ./docker/build.dockerfile \
    -t montagu-portal-build-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .
