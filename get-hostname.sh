#!/bin/bash
#
# Usage:
# ./get-hostname.sh
# Will get all unique IPs from current-topo.tsv; build an JSON object with IPs and there hostname; write to file current-hostnames.json

## DEBUG OPTION
#set -x

IPLIST=$( cut -f 1 < current-topo.tsv | grep [0-2] | sort | uniq )



HOSTNAMES=()
IPS=()
while read -r line; do
	IPS=("${IPS[@]}" "$line")
	HOSTNAMES=("${HOSTNAMES[@]}" "$( host $line | cut -d ' ' -f 5 | sed -e 's/mid[0-9]\.//' -e 's/\.olsr\.//' )")
done <<< "$IPLIST"

HNF="current-hostnames.json"
if [ -e $HNF ]; then
	rm $HNF
fi
touch $HNF

echo -n "{" >> $HNF
i=0
for host in "${HOSTNAMES[@]}"
do
	echo -n "\"${IPS[$i]}\": \"$host\"" >> $HNF
	if [ $i -lt $((${#HOSTNAMES[@]}-1)) ]; then echo -n ", " >> $HNF; fi
	(( i++ ))
done
echo "}" >> $HNF
