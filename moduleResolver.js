const Module = require('module');
const originalRequire = Module.prototype.require;

// Override the require function
Module.prototype.require = function(path) {
  if (path === 'lucide-react') {
    return originalRequire.call(this, 'lucide-react/dist/esm/lucide-react.js');
  }
  return originalRequire.call(this, path);
};