const { apiUrl, } = require("../../config");

module.exports = {
  getFullUri: ({ path, urlParams = null, debugBackend = false }) => {
    let fullUri = `${apiUrl}/${path}`;
    const usp = new URLSearchParams();
    if (urlParams) {
      for (let arg in urlParams) {
        usp.append(arg, urlParams[arg]);
      }
    }
    if (debugBackend) {
      usp.append("XDEBUG_SESSION_START", "PHP_STORM");
    }
    const argString = usp.toString();
    if (argString) {
      fullUri = `${fullUri}?${argString}`;
    }

    return fullUri;
  },
};
