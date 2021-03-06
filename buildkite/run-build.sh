#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

PORTAL_BUILD_ENV=montagu-portal-build-env:$GIT_SHA

# Clean up docker containers on exit
trap on_exit EXIT
function on_exit() {
    ./$HERE/../app/scripts/clear-docker.sh
}

./$HERE/../app/scripts/run-dependencies.sh
./$HERE/../app/scripts/add-test-accounts-for-integration-tests.sh

# In case we switch agents between steps
[ ! -z $(docker images -q $BUILD_ENV_TAG) ] || docker pull $BUILD_ENV_TAG

# The main build env which builds and tests below
docker build -f ./docker/build.dockerfile \
    -t $PORTAL_BUILD_ENV \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    --build-arg MONTAGU_GIT_BRANCH=$GIT_BRANCH \
    .

# This is the path for BuildKite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/var/lib/buildkite-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
   $PORTAL_BUILD_ENV
