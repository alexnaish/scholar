#!/bin/bash

FILENAME=phantomjs-2.0.0-macosx.zip
rm -rf tmp/
if [ ! -f phantomjs ]; then
    wget -P tmp/ https://github.com/eugene1g/phantomjs/releases/download/2.0.0-bin/$FILENAME
    unzip tmp/$FILENAME
else
    echo 'Phantom already downloaded'
fi

