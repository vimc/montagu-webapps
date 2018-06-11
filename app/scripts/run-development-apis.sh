#!/usr/bin/env bash
set -ex

here=$(dirname $0)
$here/clear-docker.sh
source $here/run-apis.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap on_interrupt INT
function on_interrupt() {
    $here/stop-apis.sh
}

# Generate test data
image=$registry/montagu-generate-test-data:$MONTAGU_API_VERSION
docker pull $image
docker run --rm --network=montagu_default $image


# Add test accounts
$here/add-test-accounts-for-integration-tests.sh

# Generate a root token for bypassing login
echo "Root token: "
docker run --rm \
    -v $TOKEN_KEY_PATH:/etc/montagu/api/token_key \
    $registry/montagu-api:$MONTAGU_API_VERSION \
    generate-token */can-login */reports.read */reports.review

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
