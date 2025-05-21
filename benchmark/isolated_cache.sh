#!/bin/bash

duration="10s"
concurrency_levels=(1 5 10 25 50 100)
total_urls=1000

for c in "${concurrency_levels[@]}"; do
  echo "Running tests for concurrency level: $c"

  # Step 1: Generate fresh short URLs
  echo "Generating $total_urls short URLs..."
  node 1000postRequests.js
  echo "Generated shortUrls.txt"

  # Step 2: Cold cache test (MongoDB only)
  cold_output="get_output_${c}conn_${duration}_cold.txt"
  echo "Running cold cache test..."
  # wrk -t"$c" -c"$c" -d"$duration" -s get_test.lua http://localhost:3000 > "$cold_output"
  wrk -t"$c" -c"$c" -d"$duration" -s get_test.lua https://url-shortener-pbhq.onrender.com > "$cold_output"
  echo "Cold output saved to $cold_output"

  # Step 3: Warm cache test (Redis)
  warm_output="get_output_${c}conn_${duration}_warm.txt"
  echo "Running warm cache test..."
  # wrk -t"$c" -c"$c" -d"$duration" -s get_test.lua http://localhost:3000 > "$warm_output"
  wrk -t"$c" -c"$c" -d"$duration" -s get_test.lua https://url-shortener-pbhq.onrender.com > "$warm_output"
  echo "Warm output saved to $warm_output"

  # Step 4: Cleanup - remove the short URLs
  echo "Cleaning up short URLs..."
  rm shortUrls.txt
  echo "Done with concurrency level: $c"
  echo "-----------------------------------"
done

echo "Benchmarking complete!"
