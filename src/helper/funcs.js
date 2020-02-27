exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

exports.delay = (message, time) => {
  return new Promise(resolve => {
    setTimeout(function() {
      const now = new Date();
      resolve(console.info(`${message}, ${now.toLocaleString()}`));
    }, time);
  });
};

exports.getCardPercentage = (cards, level, maxCards) => {
  const totalCards = cards.reduce((acc, current) => {
    if (current.displayLevel >= level) acc++;
    return acc;
  }, 0);
  return (totalCards / maxCards).toFixed(2);
};

exports.getCardPercentage2 = (cards, level, maxCards) => {
  const totalCards = cards.reduce((acc, current) => {
    let extra = 0;
    if (current.maxLevel === 5) extra = 8;
    else if (current.maxLevel === 8) extra = 5;
    else if (current.maxLevel === 11) extra = 2;
    else if (current.maxLevel === 13) extra = 0;

    if (current.level + extra >= level) acc++;
    return acc;
  }, 0);
  return (totalCards / maxCards).toFixed(2);
};

exports.parseDate = raw => {
  return raw.split(".")[0].length < 15 ||
    raw.split("T")[0].length < 8 ||
    raw.split(".")[0].split("T")[1].length < 6
    ? null
    : {
        year: raw.slice(0, 4),
        month: raw.slice(4, 6),
        day: raw.slice(6, 8),
        hour: raw.slice(9, 11),
        minute: raw.slice(11, 13),
        second: raw.slice(13, 15)
      };
};
