#!/bin/bash

d="10s"
node 100postRequests.js

for c in 1 5 10 25 50 100; do
  output_file="get_output_${c}conn_${d}.txt"

  # wrk -t"$c" -c"$c" -d"${d}" -s get_test.lua http://localhost:3000 > "$output_file"
  wrk -t"$c" -c"$c" -d"${d}" -s get_test.lua https://url-shortener-pbhq.onrender.com > "$output_file"
  echo "Output saved to $output_file"
done

rm shortUrls.txt
