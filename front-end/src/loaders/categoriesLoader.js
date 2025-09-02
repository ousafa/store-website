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


export const updateCategory = async (id, formData) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "POST", // use _method=PATCH inside formData
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Validation errors:", data.errors);
        throw new Error("Failed to update category");
    }

    return data;
};
