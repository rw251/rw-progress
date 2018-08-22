const { expect } = require('chai');
const { Progress } = require('../index');
require('jsdom-global')();

const progressId = 'nprogress';

describe('#rw-progress', () => {
  afterEach(() => {
    const el = document.getElementById(progressId);
    if (el) el.parentNode.removeChild(el);

    document.querySelectorAll('html').className = '';

    Progress.status = null;
  });

  describe('.set()', () => {
    it('.set(0) must render', () => {
      Progress.set(0);
      const progress = document.getElementById(progressId);
      expect(progress).to.not.equal(null);
      expect(progress.childNodes.length).to.equal(1);
      expect(progress.childNodes[0].className).to.equal('bar');
    });

    it('.set(1) should appear and disappear', (done) => {
      Progress.set(0).set(1);
      let progress = document.getElementById(progressId);
      expect(progress).to.not.equal(null);

      setTimeout(() => {
        progress = document.getElementById(progressId);
        expect(progress).to.not.equal(null);
        done();
      }, 70);
    });

    it('must respect minimum', () => {
      Progress.set(0);
      expect(Progress.status).to.equal(0.08);
    });

    it('must clamp to minimum', () => {
      Progress.set(-100);
      expect(Progress.status).to.equal(0.08);
    });

    it('must complete on set above 1', () => {
      Progress.set(456);
      expect(Progress.status).to.equal(null);
    });
  });

  describe('.start()', () => {
    it('must render', (done) => {
      Progress.start();
      const progress = document.getElementById(progressId);
      expect(progress).to.not.equal(null);
      done();
    });

    it('must respect minimum', () => {
      Progress.start();
      expect(Progress.status).to.equal(0.08);
    });

    it('must have body as parent', () => {
      Progress.start();
      const progress = document.getElementById(progressId);
      expect(progress.parentNode.nodeName).to.equal('BODY');
    });

    it('must increment automatically', (done) => {
      Progress.start();
      expect(Progress.status).to.equal(0.08);
      setTimeout(() => {
        expect(Progress.status).to.be.greaterThan(0.08);
        done();
      }, 300);
    });

    it('must not start twice', (done) => {
      Progress.start();
      setTimeout(() => {
        Progress.start();
        expect(Progress.status).to.be.greaterThan(0.08);
        done();
      }, 300);
    });
  });

  describe('.done()', () => {
    it('must not render without start', () => {
      Progress.done();
      const progress = document.getElementById(progressId);
      expect(progress).to.equal(null);
    });

    it('.done(true) must render', () => {
      Progress.done(true);
      const progress = document.getElementById(progressId);
      expect(progress).to.not.equal(null);
    });
  });

  describe('.remove()', () => {
    it('should be removed from the parent', () => {
      Progress.set(1);
      Progress.remove();

      const progress = document.getElementById(progressId);
      expect(progress).to.equal(null);

      const parent = document.querySelectorAll('body');
      expect(parent[0]).to.not.equal(null);
      expect(parent[0].childNodes.length).to.equal(0);
    });
  });

  describe('.inc()', () => {
    it('should render', () => {
      Progress.inc();
      const progress = document.getElementById(progressId);
      expect(progress).to.not.equal(null);
    });

    it('should start with minimum', () => {
      Progress.inc();
      expect(Progress.status).to.equal(0.08);
    });

    it('should increment', () => {
      Progress.start();
      const start = Progress.status;

      Progress.inc();
      expect(Progress.status).to.be.greaterThan(start);
    });

    it('should never reach 1.0', () => {
      for (let i = 0; i < 100; i += 1) { Progress.inc(); }
      expect(Progress.status).to.be.lessThan(1);
    });

    it('must stop eventually', () => {
      Progress.start();
      Progress.inc(0.99);
      expect(Progress.status).to.equal(0.994);
      Progress.inc();
      expect(Progress.status).to.equal(0.994);
    });
  });
});
