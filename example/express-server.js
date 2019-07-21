const express = require("express")
const Metrics = require("../src").getInstance()
const morgan = require("morgan")

const PORT = 9001
const app = express()

app.use(morgan('combined'))

// Middleware function to count total requests and the request duration for a given method
app.use((req, res, next) => {
	res.locals.startTime = Date.now()

	next()
	
	Metrics.get("http_requests_total")
		.labels(req.method, req.route.path, res.statusCode)
		.inc()
	
	const responseTimeMS = Date.now() - res.locals.startTime
	Metrics.get("http_duration_histogram_seconds")
		.labels(req.method, req.route.path, res.statusCode)
	  	.observe(responseTimeMS/1000)
})

app.get('/', (req, res, next) => {
	res.send({
		message: "Hello world!"
	})
})

app.get('/metrics', (req, res, next) => {
	res.set('Content-Type', Metrics.contentType)
	res.end(Metrics.metricsCallback())
})

// Not found middleware
app.use((req, res, next) => {
	res.status(404).send({ 
		error: "Not found"
	})
})

// Error middleware
app.use((err, req, res, next) => {
	res.status(500).send({ 
		error: err 
	})
})

app.listen(PORT, () => {
	console.log(`Server listening to ${PORT}, metrics exposed on /metrics endpoint`)
	
	// Register a requests_total metric to be used anywhere in the application
	Metrics.counter("http_requests_total", "Total HTTP requets processed", ["route", "method", "status"])
	
	// Register a http_duration metric to be used anywhere in the application
	Metrics.histogram("http_duration_histogram_seconds", "HTTP request latency distribution", 
		["route", "method", "status"], [0.01, 0.05, 0.1, 0.5, 1, 5, 10])
});