export const loginUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    // Convert response to JSON
    const data = await response.json();

    // If request failed, throw error
    if (!response.ok) {
        throw new Error(data.message || "Login failed!");
    }

    // Return token or user info
    return data;
};
