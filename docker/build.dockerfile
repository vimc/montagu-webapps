ARG MONTAGU_GIT_ID="UNKNOWN"
FROM vimc/montagu-portal-shared-build-env:$MONTAGU_GIT_ID

ARG MONTAGU_GIT_ID="UNKNOWN"
ARG MONTAGU_GIT_BRANCH="UNKNOWN"

ENV MONTAGU_GIT_ID=$MONTAGU_GIT_ID
ENV MONTAGU_GIT_BRANCH=$MONTAGU_GIT_BRANCH

# Build, tag and publish docker image
CMD docker/build-images.sh $MONTAGU_GIT_BRANCH $MONTAGU_GIT_ID