#!/bin/bash
echo "hoge"

for y in 0 1 2 3
do
 for x in 0 1 2 3 4 5 6 7
 do
  # 一番左端の画像は結合基画像とする
  horizon_name="tmp/tmp.png"
  curl "http://maps.google.com/cbk?output=tile&panoid=9tNDbLjo3DPi5lsPr0rg2A&zoom=3&x=$x&y=$y&1511263787358" > "$horizon_name"
  if [ $x -eq 0 ]
   then
   cp $horizon_name "tmp/$y.png"
   else
   convert +append "tmp/$y.png" $horizon_name "tmp/$y.png"
  fi
 done 
 vertical_name="tmp/image.png"
  if [ $y -eq 0 ]
   then
   cp "tmp/$y.png" "$vertical_name"
   else
   convert -append $vertical_name "tmp/$y.png" $vertical_name
  fi
done
 convert -crop 3328x1664+0+0  "tmp/image.png"  "image/out.png"
