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


// List Products
export const categoriesLoader = async () => {
    const response = await fetch(`${BASE_URL}/categories`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch category list");
    }

    return response.json();
};

// Show Single Category
export const categoryDetailsLoader = async ({ params }) => {
    const { id } = params;
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch category");
    }

    return response.json();
};

export const createCategory = async (formData) => {
    const response = await fetch(`${BASE_URL}/categories`, {
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

export const updateCategory = async (id, formData) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "POST", // Laravel _method=PATCH
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Validation errors:", data.errors);
        // Toujours renvoyer un objet structuré
        throw {
            message: data.message || "Validation failed",
            errors: data.errors || {},
        };
    }

    return data;
};


export const deleteCategory = async (id) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);
        throw new Error("Failed to delete category");
    }

    return response.json(); // Backend usually returns a success message
};