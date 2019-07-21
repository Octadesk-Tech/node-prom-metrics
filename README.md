# node-prom-metrics

Sample NodeJS wrapper for Prometheus metrics

## Example

If one run the example `example/express-server.js` and go to `localhost:9001/metrics`, will see the following metrics exposed. They are a very basic example of total requests (counter) and request duration (histogram).

```text
# HELP http_requests_total Total HTTP requets processed
# TYPE http_requests_total counter
http_requests_total{route="GET",method="/metrics",status="200"} 3

# HELP http_duration_histogram_seconds HTTP request latency distribution
# TYPE http_duration_histogram_seconds histogram
http_duration_histogram_seconds_bucket{le="0.01",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="0.05",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="0.1",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="0.5",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="1",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="5",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="10",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_bucket{le="+Inf",route="GET",method="/metrics",status="200"} 3
http_duration_histogram_seconds_sum{route="GET",method="/metrics",status="200"} 0.005
http_duration_histogram_seconds_count{route="GET",method="/metrics",status="200"} 3
```
