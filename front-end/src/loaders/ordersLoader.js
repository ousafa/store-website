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

export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/users`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Could not fetch users");
    const data = await response.json();
    return data.data || [];
};


// List Orders
// Get paginated orders
export const ordersLoader = async ({ request }) => {
    const url = new URL(request.url);
    const params = url.searchParams.toString(); // preserve all query params (page, filter, sort, etc.)

    const response = await fetch(`${BASE_URL}/orders?${params}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch orders");
    }

    return response.json();
};


// Show Single Order
export const orderDetailsLoader = async ({ params }) => {
    const { id } = params;
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Could not fetch order");
    }

    return response.json();
};

export const createOrder = async (formData) => {
    const response = await fetch(`${BASE_URL}/orders`, {
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

export const updateOrder = async (id, status) => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "POST", // Laravel will see _method = PATCH
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            _method: "PATCH",
            status: status, // 👈 send directly
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Validation errors:", data.errors);
        throw {
            message: data.message || "Validation failed",
            errors: data.errors || {},
        };
    }

    return data;
};



export const deleteOrder = async (id) => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting order:", errorData);
        throw new Error("Failed to delete order");
    }

    return response.json(); // Backend usually returns a success message
};