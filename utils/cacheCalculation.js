export function getCacheDetails({
  cacheHits,
  cacheMisses,
  hit_latency_sum,
  miss_latency_sum,
}) {
  const hits = parseInt(cacheHits) || 0;
  const misses = parseInt(cacheMisses) || 0;
  const hitLatencySum = parseInt(hit_latency_sum) || 0;
  const missLatencySum = parseInt(miss_latency_sum) || 0;
  const req = hits + misses;
  const avgHitLatency = hits > 0 ? Math.floor(hitLatencySum / hits) : 0;
  const avgMissLatency = misses > 0 ? Math.floor(missLatencySum / misses) : 0;
  const avgLatency =
    req > 0 ? Math.floor((hitLatencySum + missLatencySum) / req) : 0;
  const hitRate = req > 0 ? Math.floor((hits / req) * 100) : 0;
  const missRate = req > 0 ? Math.floor((misses / req) * 100) : 0;
  return {
    cacheHits: hits,
    cacheMisses: misses,
    avgHitLatency,
    avgMissLatency,
    avgLatency,
    hitRate,
    missRate,
  };
}
