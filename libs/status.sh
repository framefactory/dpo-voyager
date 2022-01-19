#!/bin/bash
# CHECK STATUS OF ALL LIBRARIES

function status {
    echo "----- status $1 -----"
    cd $PWD/$1
    git status -s -b
    cd ..
}

status ff-browser
status ff-core
status ff-graph
status ff-scene
status ff-three
status ff-ui
