const cache = require('memory-cache');
const { isNil, isEmpty } = require('lodash');

// singleton pattern to retrieve in-memory storage
const getStorageInstance = () => {
    if (isNil(cache)) {
        return new cache.Cache();
    }

    return cache;
}

// generate random Integer inclusively
function generateIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// generate random date
function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// generate 5 developers into array randomly
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

// check if product has empty object besides productId
function checkIsEmpty(product) {
    if (isEmpty(product)) {
        return true;
    }

    return Object.keys(product).length === 1 && !isNil(product.productId);
}

module.exports = {
    getStorageInstance,
    generateIntInclusive,
    generateRandomDate,
    getRandomDevelopers,
    checkIsEmpty
}