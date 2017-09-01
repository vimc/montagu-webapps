#!/usr/bin/env bash
set -ex

here=$(dirname $0)
$here/clear-docker.sh

export MONTAGU_API_VERSION=$(<config/api_version)
export MONTAGU_REPORTING_API_VERSION=$(<config/reporting_api_version)
export MONTAGU_DB_VERSION=$(<config/db_version)
export TOKEN_KEY_PATH=$pwd/token_key
cert_tool_version=master
orderly_version=master
registry=docker.montagu.dide.ic.ac.uk:5000

# Generate a keypair
docker run --rm \
    -v $TOKEN_KEY_PATH:/workspace \
    $registry/montagu-cert-tool:$cert_tool_version \
    gen-keypair /workspace

# Run the APIs and database
docker-compose pull
docker-compose --project-name montagu up -d

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
docker exec montagu_reporting_api_1 mkdir -p /etc/montagu/reports_api
docker exec montagu_reporting_api_1 touch /etc/montagu/reports_api/go_signal