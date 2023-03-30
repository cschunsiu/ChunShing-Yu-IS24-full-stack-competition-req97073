const url = 'http://localhost:3000/api';

const getProducts = async () => {
    const response = await fetch(`${url}/products` );
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}

const addProduct = async (product) => {
    const response = await fetch(`${url}/product`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
}

const editProduct = async (product) => {
    const response = await fetch(`${url}/product`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
}

const deleteProduct = async (product) => {
    const response = await fetch(`${url}/product`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
}

const searchProduct = async (requirements) => {
    const response = await fetch(`${url}/products/search`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requirements)
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
}

export const ApiService = {
    getProducts,
    addProduct,
    deleteProduct,
    editProduct,
    searchProduct
}