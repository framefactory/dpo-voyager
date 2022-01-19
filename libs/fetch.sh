#!/bin/bash
# FETCH ALL LIBRARIES AND CHECKOUT MASTER

function fetch {
    echo "----- fetch/master $1 -----"
    cd $PWD/$1
    git fetch && git checkout master
    cd ..
}

fetch ff-browser
fetch ff-core
fetch ff-graph
fetch ff-scene
fetch ff-three
fetch ff-ui
