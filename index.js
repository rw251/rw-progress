const queue = (() => {
  const pending = [];

  function next() {
    const fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }

  return (fn) => {
    pending.push(fn);
    if (pending.length === 1) next();
  };
})();

exports.Progress = {
  status: null,
  positionUsing: 'translate3d',

  isStarted() {
    return typeof this.status === 'number';
  },

  isRendered() {
    return !!document.getElementById('rwp');
  },

  done(force) {
    if (!force && !this.status) return this;

    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  },

  remove() {
    const progress = document.getElementById('rwp');
    if (progress && progress.parentNode) progress.parentNode.removeChild(progress);
  },

  render(fromStart) {
    if (this.isRendered()) return document.getElementById('rwp');

    const progress = document.createElement('div');
    progress.id = 'rwp';
    progress.innerHTML = '<div class="b" role="bar"><div class="peg"></div></div>';

    const bar = progress.querySelector('[role="bar"]');
    const perc = fromStart ? '-100' : (-1 + (this.status || 0)) * 100;
    const parent = document.querySelector('body');

    bar.style.transition = 'all 0 linear';
    bar.style.transform = `translate3d(${perc}%,0,0)`;

    parent.appendChild(progress);
    return progress;
  },

  set(val) {
    const started = this.isStarted();

    const n = Math.min(Math.max(val, 0.08), 1);
    this.status = (n === 1 ? null : n);

    const progress = this.render(!started);
    const bar = progress.querySelector('[role="bar"]');
    const speed = 200;
    const ease = 'linear';

    // eslint-disable-next-line no-unused-expressions
    progress.offsetWidth; /* Getting this property causes a reflow and repaint (https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance/) */

    queue((next) => {
      // Add transition
      bar.style.transform = `translate3d(${(-1 + n) * 100}%,0,0)`;
      bar.style.transition = `all ${speed}ms ${ease}`;

      if (n === 1) {
        // Fade out
        progress.style.transition = 'none';
        progress.style.opacity = 1;
        // eslint-disable-next-line no-unused-expressions
        progress.offsetWidth; /* Getting this property causes a reflow and repaint (https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance/) */

        setTimeout(() => {
          progress.style.transition = `all ${speed}ms linear`;
          progress.style.opacity = 0;

          setTimeout(() => {
            this.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  },

  inc(amount) {
    const n = this.status;
    let incAmount = amount;

    if (!n) {
      return this.start();
    }
    if (typeof incAmount !== 'number') {
      if (n >= 0 && n < 0.976) {
        incAmount = -0.04289716316 * Math.log(n) - 0.0004519479162;
      } else {
        incAmount = 0;
      }
    }

    return this.set(Math.min(Math.max(n + incAmount, 0), 0.994));
  },

  start() {
    if (!this.status) this.set(0);

    const work = () => {
      setTimeout(() => {
        if (!this.status) return;
        this.inc();
        work();
      }, 200);
    };

    work();

    return this;
  },
};
