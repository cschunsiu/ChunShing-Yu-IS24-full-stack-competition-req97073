const Util = require('../util/index');

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
            Developers: Util.getRandomDevelopers(developerNameArr),
            scrumMasterName: scrumMasterNameArr[randomScrumMasterIndex],
            startDate: `${randomDate.getFullYear()}/${randomDate.getMonth()+1}/${randomDate.getDate()}`,
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

const getProductById = (productId) => {
    console.log(`Service: get product by Id: ${productId}`);
    try {
        const storage = Util.getStorageInstance();

        const dataSet = storage.get('data');

        const filteredData = dataSet.data.filter(product => product.productId === productId);

        if (filteredData.length === 0) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
        }

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
        const storage = Util.getStorageInstance();

        const dataSet = storage.get('data');

        const nextProductIndex = dataSet.productIdStartingSequence;

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
        const targetId = parseInt(product.productId);
        let productFromDb = getProductById(targetId);

        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');
        dataSet.data.forEach((item, index) => {
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
        let productFromDb = getProductById(targetId);

        const storage = Util.getStorageInstance();
        const dataSet = storage.get('data');
        dataSet.data.forEach((item, index) => {
            if (item.productId === targetId) {
                dataSet.data.splice(index, 1);
            }
        })
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
    deleteProduct
}