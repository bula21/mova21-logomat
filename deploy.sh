#!/bin/bash

set -ex

rm -rf dist
yarn build
./write_version.sh
rsync --verbose --delete --archive --compress --rsh=ssh \
  dist/ \
  bcaaef3@sl142.web.hostpoint.ch:www/logomat.verteilt.com/
