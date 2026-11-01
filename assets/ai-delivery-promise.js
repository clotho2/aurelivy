/*
  Aurel & Ivy: delivery promise ("Order today, arrives Thu, Nov 19 – Tue, Nov 24").
  Business-day math in US Eastern time, skipping weekends and listed holidays.
  Default window: 4–7 business days after the order date
  (Selfnamed: ~2 business days to ship + 2–5 business days in transit).
*/
(function (root) {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar date (Y, M, D) of an instant in a given IANA time zone, as a UTC-noon Date.
  function calendarDate(instant, timeZone) {
    var parts = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
      .formatToParts(instant)
      .forEach(function (p) {
        parts[p.type] = p.value;
      });
    return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12));
  }

  function isoDay(d) {
    return d.toISOString().slice(0, 10);
  }

  function isBusinessDay(d, holidays) {
    var dow = d.getUTCDay();
    if (dow === 0 || dow === 6) return false;
    return holidays.indexOf(isoDay(d)) === -1;
  }

  function addBusinessDays(start, n, holidays) {
    var d = new Date(start.getTime());
    var added = 0;
    while (added < n) {
      d.setUTCDate(d.getUTCDate() + 1);
      if (isBusinessDay(d, holidays)) added += 1;
    }
    return d;
  }

  function parseHolidays(text) {
    return String(text || '')
      .split(/[\s,]+/)
      .filter(function (s) {
        return /^\d{4}-\d{2}-\d{2}$/.test(s);
      });
  }

  function format(d) {
    return DAYS[d.getUTCDay()] + ', ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate();
  }

  /*
    opts: { now: Date, minDays, maxDays, holidays: [iso], cutoff: Date|null, christmas: iso, timeZone }
    returns { earliest, latest, earliestLabel, latestLabel, phase }
    phase: 'before-cutoff' | 'after-cutoff' (until Christmas) | 'normal'
  */
  function estimate(opts) {
    var now = opts.now || new Date();
    var holidays = opts.holidays || [];
    var orderDay = calendarDate(now, opts.timeZone);
    var earliest = addBusinessDays(orderDay, opts.minDays || 4, holidays);
    var latest = addBusinessDays(orderDay, opts.maxDays || 7, holidays);
    var phase = 'normal';
    if (opts.cutoff && !isNaN(opts.cutoff.getTime())) {
      var christmas = opts.christmas ? new Date(opts.christmas + 'T23:59:59-05:00') : null;
      if (now.getTime() <= opts.cutoff.getTime()) phase = 'before-cutoff';
      else if (christmas && now.getTime() <= christmas.getTime()) phase = 'after-cutoff';
    }
    return {
      earliest: earliest,
      latest: latest,
      earliestLabel: format(earliest),
      latestLabel: format(latest),
      phase: phase
    };
  }

  var api = { estimate: estimate, addBusinessDays: addBusinessDays, parseHolidays: parseHolidays, calendarDate: calendarDate, format: format };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AiDelivery = api;

  if (typeof customElements !== 'undefined' && !customElements.get('ai-delivery-promise')) {
    customElements.define(
      'ai-delivery-promise',
      class extends HTMLElement {
        connectedCallback() {
          var d = this.dataset;
          var cutoff = d.cutoff ? new Date(d.cutoff) : null;
          var r = estimate({
            minDays: parseInt(d.minDays, 10) || 4,
            maxDays: parseInt(d.maxDays, 10) || 7,
            holidays: parseHolidays(d.holidays),
            cutoff: cutoff,
            christmas: d.christmas
          });
          var range = this.querySelector('[data-range]');
          if (range) range.textContent = r.earliestLabel + ' \u2013 ' + r.latestLabel;
          this.querySelectorAll('[data-phase]').forEach(function (el) {
            el.hidden = el.getAttribute('data-phase') !== r.phase;
          });
          this.hidden = false;
        }
      }
    );
  }
})(typeof window !== 'undefined' ? window : globalThis);
