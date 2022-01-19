#!/bin/bash
# PULL ALL LIBRARIES

function pull {
    echo "----- pull $1 -----"
    cd $PWD/$1
    git pull origin master
    git checkout master
    cd ..
}

pull ff-browser
pull ff-core
pull ff-graph
pull ff-scene
pull ff-three
pull ff-ui
