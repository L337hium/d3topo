#!/bin/bash
HOST="10.63.43.1"
PORT=2006

echo -e "dest\tsrc\tnlq\tlq\tcost" > current-topo.tsv
echo "/topo" | nc $HOST $PORT | tail -n +6 >> current-topo.tsv
