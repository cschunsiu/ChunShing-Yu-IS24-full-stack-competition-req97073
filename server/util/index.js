const cache = require('memory-cache');
const { isNil, isEmpty } = require('lodash');

const getStorageInstance = () => {
    if (isNil(cache)) {
        return new cache.Cache();
    }

    return cache;
}

function generateIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomDevelopers(nameArr) {
    const min = 1;
    const max = 5;

    const randomNumOfDevelopers = generateIntInclusive(min, max);
    const result = [];

    while (result.length !== randomNumOfDevelopers) {
        const randomIndex = generateIntInclusive(0, nameArr.length-1);
        if (!result.includes(nameArr[randomIndex])) {
            result.push(nameArr[randomIndex]);
        }
    }

    return result;
}

module.exports = {
    getStorageInstance,
    generateIntInclusive,
    generateRandomDate,
    getRandomDevelopers
}