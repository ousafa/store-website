// Global Variable
const BASE_URL = "http://127.0.0.1:8000/api/v1";



// List Products
export const productsLoader = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/products`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Could not fetch product list");
    }

    return response.json();
};

//Show Single Produt
export const productDetailsLoader = async ({ params }) => {
    const { id } = params;
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/products/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Could not fetch product");
    }

    return response.json();
};
