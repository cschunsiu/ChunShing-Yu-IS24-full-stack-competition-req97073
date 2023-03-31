const Util = require('../util/index');
const {isEmpty, isNil, isNaN} = require("lodash");
const moment = require("moment");

// populate data when server init
const prePopulateData = () => {
    const storage = Util.getStorageInstance();

    const dataSet = {
        productIdStartingSequence: 1,
        data : []
    }

    const developerNameArr = [
        "Keshawn Epstein",
        "Shyanne Stokes",
        "Deondre Coates",
        "Diego Donahue",
        "Tasia Good",
        "Maren Vickery",
        "Geovanni Hathaway",
        "Meghan Quarles",
        "Blaine Boyle",
        "Jack Cardona",
    ];
    const productOwnerNameArr = [
        "Jacy Pierson",
        "Silvia Chow",
        "Farrah Shin",
        "Jerod Brumfield",
        "Lorraine Hayward",
    ];
    const scrumMasterNameArr = [
        "Davonte Conroy",
        "Jarvis Sun",
        "Keyshawn Limon",
        "Klarissa Anguiano",
        "Cortez Severson",
    ];
    let methodologyArr = [
        "Agile",
        "Waterfall"
    ];
    let productNameArr = [
        "Blueprint Software",
        "Angel Software",
        "Softwarebea",
        "Softwareworks",
        "Cerberus Software",
        "Accelerate Software",
        "Absolute Software",
        "Scoot Software",
        "Softwareara",
        "Fireball Software",
        "Dynamo Software",
        "Phantom Software",
        "Lynx Software",
        "Softwarenest",
        "Magnolia Software",
        "Mammoth Software",
        "Complex Software",
        "Softwarex",
        "Vortex Software",
        "Aura Software",
        "Ark",
        "Anywhere Software",
        "App Desk",
        "App Incubator",
        "App Binary",
        "App Dev",
        "App Interactive",
        "App Tenacious",
        "Zealous",
        "Air",
        "Smart App",
        "Mecha",
        "Van",
        "Bam",
        "Ware",
        "App Jam",
        "Aiyo",
        "ThunderBird",
        "Cypto Tax",
        "Infinity",
    ];
    let activeProductCounter = 3;

    // generate random products in a loop
    while (productNameArr.length !== 0) {
        const randomProductIndex = Util.generateIntInclusive(0, productNameArr.length-1);
        const randomProductOwnerIndex = Util.generateIntInclusive(0, productOwnerNameArr.length-1);
        const randomScrumMasterIndex = Util.generateIntInclusive(0, scrumMasterNameArr.length-1);
        const randomMethodologyIndex = Util.generateIntInclusive(0, methodologyArr.length-1);
        const randomDate = activeProductCounter > 0 ?
            Util.generateRandomDate(new Date(2022, 0, 1), new Date()) : Util.generateRandomDate(new Date(2023, 5, 1), new Date(2025, 5, 1));


        const obj = {
            productId: dataSet.productIdStartingSequence,
            productName: productNameArr[randomProductIndex],
            productOwnerName: productOwnerNameArr[randomProductOwnerIndex],
            developers: Util.getRandomDevelopers(developerNameArr),
            scrumMasterName: scrumMasterNameArr[randomScrumMasterIndex],
            startDate: moment(randomDate).format("YYYY/MM/DD"),
            methodology: methodologyArr[randomMethodologyIndex]
        }

        dataSet.data.push(obj);

        dataSet.productIdStartingSequence++;
        activeProductCounter--;
        productNameArr.splice(randomProductIndex, 1);
    }

    storage.put('data', dataSet);
    console.log('Service: Data has been populated');
}

// get list of products
const getProducts = () => {
    console.log('Service: get products');
    try {
        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');

        return dataSet.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// get product by productId
const getProductById = (productId) => {
    console.log(`Service: get product by Id: ${productId}`);
    try {
        // check if productId is present
        if (isNil(productId) || isNaN(parseInt(productId))) {
            const err = new Error(`Invalid param: ${productId}`);
            err.status = 400;
            throw err;
        }

        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');

        // filter product list by productId
        const filteredData = dataSet.data.filter(product => product.productId === productId);

        // if list has no products, return not found error
        if (filteredData.length === 0) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
        }

        // not suppose to have two products with the same productId
        if (filteredData.length > 1) {
            const err = new Error('Duplicate product found');
            err.status = 409;
            throw err;
        }

        return filteredData[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const createProduct = (product) => {
    console.log(`Service: create product: ${JSON.stringify(product)}`);
    try {
        // check if product is empty
        if (Util.checkIsEmpty(product)) {
            const err = new Error('Cannot accept empty object');
            err.status = 400;
            throw err;
        }

        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');
        // get the next sequence productId
        const nextProductIndex = dataSet.productIdStartingSequence;

        // create product object
        const productObj = {
            ...product,
            productId: nextProductIndex
        }

        dataSet.productIdStartingSequence++
        dataSet.data.push(productObj);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateProduct = (product) => {
    console.log(`Service: update product: ${JSON.stringify(product)}`);
    try {
        // check if product is empty, cannot update from nothing
        if (Util.checkIsEmpty(product)) {
            const err = new Error('Cannot accept empty object');
            err.status = 400;
            throw err;
        }

        const targetId = parseInt(product.productId);
        // try to get this product without error
        let productFromDb = getProductById(targetId);
        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');

        dataSet.data.forEach((item, index) => {
            // found product with the same productId and update product
            if (item.productId === targetId) {
                dataSet.data[index] = {...product};
                return dataSet.data[index];
            }
        })

        return productFromDb;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deleteProduct = (product) => {
    console.log(`Service: delete product: ${JSON.stringify(product)}`);
    try {
        const targetId = parseInt(product.productId);
        // try to get this product without error
        let productFromDb = getProductById(targetId);
        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');
        dataSet.data.forEach((item, index) => {
            // find position of targeted product and remove it
            if (item.productId === targetId) {
                dataSet.data.splice(index, 1);
            }
        })
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getProductsBySearchTerm = (requirement) => {
    console.log(`Service: get products by search term: ${JSON.stringify(requirement)}`);
    try {
        const { type = '', term = '' } = requirement;
        const SUPPORT_TYPE = {
            DEVELOPERS: 'developers',
            SCRUM_MASTER_NAME: 'scrumMasterName'
        }

        // ensure only accepted type is being consumed
        if (type !== SUPPORT_TYPE.DEVELOPERS && type !== SUPPORT_TYPE.SCRUM_MASTER_NAME) {
            const err = new Error('Search type is not supported');
            err.status = 400;
            throw err;
        }

        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');
        const resultSet = [];

        // always return if term is empty or null
        if (isEmpty(term)) {
            return dataSet.data;
        }

        dataSet.data.forEach((product) => {
            // compare name with lowercase and match product that has the name in it
            if (type === SUPPORT_TYPE.SCRUM_MASTER_NAME && product[type].toLowerCase().includes(term.toLowerCase())) {
                resultSet.push(product);
            }
            if (type === SUPPORT_TYPE.DEVELOPERS) {
                // compare each name in array with lowercase and match product that has the name in it
                product[type].forEach(dev => {
                    if (dev.toLowerCase().includes(term.toLowerCase())) {
                        resultSet.push(product);
                    }
                })
            }
        })

        return resultSet;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    prePopulateData,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySearchTerm
}