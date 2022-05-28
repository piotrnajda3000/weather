import events from "../events";

export default (function unitPreference() {
  const setDefault = function setDefaultUnits() {
    localStorage.setItem("unitPreference", "metric");
    events.publish("Update unit checkbox", "metric");
  };

  const set = (unit) => {
    localStorage.setItem("unitPreference", unit);
    events.publish("Update unit checkbox", unit);
  };

  const get = () => {
    if (!localStorage.getItem("unitPreference")) {
      return setDefault();
    } else {
      let unit = localStorage.getItem("unitPreference");
      events.publish("Update unit checkbox", unit);
      return unit;
    }
  };

  return {
    set,
    get,
  };
})();
