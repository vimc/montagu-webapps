#!/usr/bin/env bash
set -e

git_branch=$1
git_id=$2
registry=docker.montagu.dide.ic.ac.uk:5000
contrib_name=montagu-contrib-portal
admin_name=montagu-admin-portal

echo "Beginning webapp build with:"
echo "Branch: $git_branch"
echo "Commit hash: $git_id"

export MONTAGU_PORTAL_PROFILE=teamcity
npm run test

export MONTAGU_PORTAL_PROFILE=docker
webpack

echo "Building contribution portal image"
docker build -f docker/run.dockerfile \
    -t $registry/$contrib_name:$git_id \
    -t $registry/$contrib_name:$git_branch \
    --build-arg APP_NAME=contrib \
    .

echo "Building admin portal image"
docker build -f docker/run.dockerfile \
    -t $registry/$admin_name:$git_id \
    -t $registry/$admin_name:$git_branch \
    --build-arg APP_NAME=admin \
    .

function push {
	id=$1
	echo "Pushing $id"
	docker push $id
}

push $registry/$contrib_name:$git_id
push $registry/$contrib_name:$git_branch
push $registry/$admin_name:$git_id
push $registry/$admin_name:$git_branch
