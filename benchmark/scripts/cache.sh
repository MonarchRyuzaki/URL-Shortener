#!/bin/bash

d="10s"

# 1) Generate short URLs
node 1000postRequests.js

# 2) Warm up Redis cache once
echo "Warming cache..."
# wrk -t5 -c10 -d5s -s get_test.lua http://localhost:3000 > /dev/null
wrk -t5 -c10 -d5s -s get_test.lua https://url-shortener-pbhq.onrender.com > /dev/null

# 3) Benchmark loop
for c in 1 5 10 25 50 100; do
  ts=$(date +%Y%m%d_%H%M%S)
  output_file="get_${c}conn_${d}_${ts}.txt"
  echo "Running $c connections for $d …"
  # wrk -t"$c" -c"$c" -d"$d" -s get_test.lua http://localhost:3000 > "$output_file"
  wrk -t"$c" -c"$c" -d"$d" -s get_test.lua https://url-shortener-pbhq.onrender.com > "$output_file"
  echo "Results saved to $output_file"
done

# 4) Clean up (optional)
# rm shortUrls.txt
