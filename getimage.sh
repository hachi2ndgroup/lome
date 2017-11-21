#!/bin/bash

panoid=$1

for y in 0 1 2 3
do
   curl -o "tmp/#1.png" "http://maps.google.com/cbk?output=tile&panoid=$panoid&zoom=3&x=[0-7]&y=$y"
   convert +append "tmp/0.png" "tmp/1.png" "tmp/2.png" "tmp/3.png" "tmp/4.png" "tmp/5.png" "tmp/6.png" "tmp/7.png" "tmp/h-$y.png"
done
 convert -append "tmp/h-0.png" "tmp/h-1.png" "tmp/h-2.png" "tmp/h-3.png" "tmp/image.png"
 convert -crop 3328x1664+0+0  "tmp/image.png"  "image/$panoid.png"

