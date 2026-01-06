/**
 * JSDOM-safe mock for Leaflet.
 * The app uses:
 * - L.Icon.Default.prototype._getIconUrl (deleted)
 * - L.Icon.Default.mergeOptions(...)
 * - L.divIcon(...)
 *
 * We provide minimal stubs to satisfy those calls in Jest.
 */

const IconDefault = function IconDefault() {};
IconDefault.prototype._getIconUrl = function _getIconUrl() {
  return "";
};

// jest.fn is available in Jest runtime; CRA sets it up.
IconDefault.mergeOptions = jest.fn();

function divIcon(options = {}) {
  return {
    options,
    // Leaflet icons are objects; callers only pass this through.
    _isMockDivIcon: true,
  };
}

module.exports = {
  __esModule: true,
  default: {
    Icon: {
      Default: IconDefault,
    },
    divIcon,
  },
  Icon: {
    Default: IconDefault,
  },
  divIcon,
};
