// Global Variable
const BASE_URL = "http://127.0.0.1:8000/api/v1";

// Helper: get headers with token
const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem("token");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
    if (!isFormData) headers["Content-Type"] = "application/json";
    return headers;
};

export const getCategories = async () => {
    const response = await fetch(`${BASE_URL}/categories`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Could not fetch categories");
    const data = await response.json();
    return data.data || [];
};


// List Products
export const productsLoader = async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;

    const response = await fetch(`${BASE_URL}/products?page=${page}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch products");
    }

    return response.json();
};

// Show Single Product
export const productDetailsLoader = async ({ params }) => {
    const { id } = params;
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch product");
    }

    return response.json();
};

// Create Product
export const createProduct = async (formData) => {
    const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Validation errors:", data.errors);
        throw data.errors;
    }

    return data;
};

export const updateProduct = async (id, payload, isFormData = false) => {
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    if (!isFormData) headers["Content-Type"] = "application/json";

    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "POST", // use _method=PUT inside FormData
        headers,
        body: payload,
    });
    const data = await response.json();

    if (!response.ok) {
        console.error("Validation errors:", data.errors);
        throw data.errors;
    }

    return data;
};





// Delete Product
export const deleteProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData);
        throw new Error("Failed to delete product");
    }

    return response.json(); // Backend usually returns a success message
};


// Order Product
export const orderProduct = async (payload) => {
    const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        // Throw an actual Error object with message
        const message = data.message || "Failed to order product";
        const err = new Error(message);
        err.errors = data.errors || null; // optional, for detailed errors
        throw err;
    }

    return data;
};
