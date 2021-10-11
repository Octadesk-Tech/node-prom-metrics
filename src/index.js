const Prometheus = require('prom-client')

class Metrics {
  constructor() {
    // Setup the register where all the metrics will be stored
    this._register = Prometheus.register

    // Enable default metrics gathering such as heap size, garbage collector stuff etc
    Prometheus.collectDefaultMetrics()

    // Set the content-type header reference for client retrieving
    this.contentType = this._register.contentType
  }

  getInstance() {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics()
    }
    return Metrics.instance
  }

  /**
   * Set default labels to be appended to every single metric generated in the whole execution
   * based on an object {key1:value1, key2:value2}
   * @param {Object} labelNames
   */
  setDefaultLabelNames(labelNames) {
    this._register.setDefaultLabels(labelNames)
  }

  /**
   * Despite the fact that this class is totally server-framework independent, this method is
   * intended to help as a callback for route resolving in express.js scenarios (example) so
   * one can retrieve all the metrics stored in Prometheus registry
   *
   * app.get('/metrics', (req, res) => {
   *  res.set('Content-Type', Metrics.contentType)
   *  res.end(Metrics.metricsCallback())
   * });
   */
  metricsCallback() {
    return this._register.metrics()
  }

  /**
   * Return a metric from Prometheus registry to be used
   * @param {string} metricName
   */
  get(metricName) {
    return this._register.getSingleMetric(metricName)
  }

  /**
   * Extend Prometheus Counter class, which provides the following methods
   *  inc(number)         :void               Increment the counter by the provided number value
   *  labels(string[])    :Counter.Internal   Return the counter with the provided labels set
   *  reset()             :void               Reset the counter value to zero
   *  remove(string[])    :void               Remove metrics for the provided labels
   * @param {string}      metricName
   * @param {string}      metricName
   * @param {string[]}    labelNames
   */
  counter(name, help, labelNames) {
    let c = new Prometheus.Counter({
      name: name,
      help: help,
      labelNames: labelNames
    })
    this._register.registerMetric(c)
  }

  /**
   * Extend Prometheus Gauge class, which provides the following methods
   *  inc(number)         :void           Increment the counter by the provided number value
   *  dec(number)         :void           Increment the counter by the provided number value
   *  set(number)         :void           Set the gauge to the provided number value
   *  labels(string[])    :Gauge.Internal Return the gauge with the provided labels set
   *  reset()             :void           Reset the counter value to zero
   *  remove(string[])    :void           Remove metrics for the provided labels
   *
   * There is also a special case of this class named Timer. In fact this is a concept and not
   * another class itself
   *  startTimer()        :function       Starts a timer which will be the gauge value once you
   *                                      call the function returned on this method call
   * @param {string}      name
   * @param {string}      help
   * @param {string[]}    labelNames
   */
  gauge(name, help, labelNames) {
    let g = new Prometheus.Gauge({
      name: name,
      help: help,
      labelNames: labelNames
    })
    this._register.registerMetric(g)
  }

  /**
   * Extend Prometheus Histogram class, which provides the following methods
   * startTimer()     :function           Start a timer which will be the histogram value once
   *                                      you call the function returned on this method call
   * labels(string[]) :Histogram.Internal Return the histogram with the provided labels set
   * observe(number)  :voic               Observe value in histogram
   * reset()          :void               Reset the counter value to zero
   * remove(string[]) :void               Remove metrics for the provided labels
   * @param {string}      name
   * @param {string}      help
   * @param {string[]}    labelNames
   * @param {number[]}    buckets
   */
  histogram(name, help, labelNames, buckets) {
    let h = new Prometheus.Histogram({
      name: name,
      help: help,
      labelNames: labelNames,
      buckets: buckets
    })
    this._register.registerMetric(h)
  }

  /**
   * Extend Prometheus Summary class, which provides the following methods
   * startTimer()     :function           Start a timer which will be the summary value once
   *                                      you call the function returned on this method call
   * labels(string[]) :Summary.Internal   Return the summary with the provided labels set
   * observe(number)  :void               Observe value in summary
   * reset()          :void               Reset the counter value to zero
   * remove(string[]) :void               Remove metrics for the provided labels
   * @param {string}      name
   * @param {string}      help
   * @param {string[]}    labelNames
   * @param {number[]}    percentiles
   */
  summary(name, help, labelNames, percentiles) {
    let s = new Prometheus.Summary({
      name: name,
      help: help,
      labelNames: labelNames,
      percentiles: percentiles
    })
    this._register.registerMetric(s)
  }
}

module.exports = new Metrics()
