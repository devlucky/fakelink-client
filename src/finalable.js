/**
 * TODO: Try to use Proxy
 */
module.exports = promise => {
  const response = {
    then(...args) {
      promise.then.call(promise, ...args);

      return response;
    },
    catch(...args) {
      promise.catch.call(promise, ...args);

      return response;
    },
    finally(...args) {
      promise.then.call(promise, ...args);
      promise.catch.call(promise, ...args);

      return response;
    }
  };

  return response;
};