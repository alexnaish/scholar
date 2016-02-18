#!/bin/bash

FILENAME=phantomjs-2.1.1-macosx
rm -rf tmp/

if [ ! -f phantomjs ]; then
    wget -P tmp/ https://bitbucket.org/ariya/phantomjs/downloads/$FILENAME.zip
    unzip tmp/$FILENAME
    rm -rf tmp
    mv $FILENAME/bin/phantomjs phantomjs
    rm -rf $FILENAME
else
    echo 'Phantom already downloaded'
fi
