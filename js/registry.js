// Content registry: each js/content/*.js file calls CQ.unit({...}).
window.CQ = {
  units: [],
  unit(u) {
    try {
      if (!u || !u.id || !Array.isArray(u.lessons)) throw new Error('invalid unit');
      this.units.push(u);
      this.units.sort((a, b) => a.order - b.order);
    } catch (e) { console.error('[CQ] failed to register unit', u && u.id, e); }
  },
  widgets: {}
};
