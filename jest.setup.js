if (typeof structuredClone === "undefined") {
  globalThis.structuredClone = function structuredClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  };
}
