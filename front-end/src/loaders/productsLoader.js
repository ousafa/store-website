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
export const productsLoader = async () => {
    const response = await fetch(`${BASE_URL}/products`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch product list");
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
export const createProduct = async (data, isFormData = false) => {
    const token = localStorage.getItem("token");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
    // if (!isFormData) headers["Content-Type"] = "application/json";

    const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers,
        body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log("Validation errors:", errorData.errors);
        throw new Error("Failed to create product");
    }

    return response.json();
};
// Update Product
export  const updateProduct = async (id, formData) => {
    try {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Validation errors:", data.errors);
            throw new Error("Failed to update product");
        }

        return data;
    } catch (error) {
        console.error("Update product failed:", error);
        throw error;
    }
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
