#!/bin/bash

panoid=$1
prefix="tmp/$1"
for y in 0 1 2 3
do
   curl -o "${prefix}_#1.png" "http://maps.google.com/cbk?output=tile&panoid=$panoid&zoom=3&x=[0-7]&y=$y"
   convert +append "${prefix}_0.png" "${prefix}_1.png" "${prefix}_2.png" "${prefix}_3.png" "${prefix}_4.png" "${prefix}_5.png" "${prefix}_6.png" "${prefix}_7.png" "${prefix}_h-$y.png"
done
 convert -append "${prefix}_h-0.png" "${prefix}_h-1.png" "${prefix}_h-2.png" "${prefix}_h-3.png" "${prefix}_image.png"
 convert -crop 3328x1664+0+0  "${prefix}_image.png"  "image/$panoid.png"
 rm ${prefix}*
