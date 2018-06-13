import Sample from './sample';
import BuildingSites from './building-sites';
import Order from './order';

const ERRORS = {
  ERROR_401: 'ERROR_401',
  ERROR_500: 'ERROR_500'
};
const LOADING = {
  GLOBAL_LOADING_START: 'GLOBAL_LOADING_START',
  GLOBAL_LOADING_END: 'GLOBAL_LOADING_END'
};

function wrapExceptionHandler(actions) {
  const retActions = {};
  Object.keys(actions).forEach((key) => {
    const handler = actions[key];
    retActions[key] = async function (...args) {
      try {
        const result = await handler.apply(this, args);
        return result;
      } catch (response) {
        let type = ERRORS.ERROR_500;
        switch (response.code) {
          case 401:
          case '-401':
            type = ERRORS.ERROR_401;
            break;
          default:
            type = ERRORS.ERROR_500;
        }
        return {
          type,
          payload: response
        };
      }
    };
  });
  return retActions;
}

module.exports = wrapExceptionHandler({
  ...Sample.ACTION,
  ...BuildingSites.ACTION,
  ...Order.ACTION
});

module.exports.ACTION_TYPES = {
  ...ERRORS,
  ...LOADING,
  ...Sample.ACTION_TYPES,
  ...BuildingSites.ACTION_TYPES,
  ...Order.ACTION_TYPES
};
