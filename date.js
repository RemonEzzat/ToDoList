//jshint esversion: 6

exports.getDate = function() {
  // for Date in differnce language and style
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleString("en-US", options);
};

exports.getDay = function() {
  // for Date in differnce language and style
  const today = new Date();
  const options = {
    weekday: "long",
  };

  return today.toLocaleString("en-US", options);

};

console.log(module.exports);
