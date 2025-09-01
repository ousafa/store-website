export const productsLoader = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/products");
    console.log(response);
    if (!response.ok) {
        throw Error('Could not found product list');
    }

    return response.json();
};


export const productDetailsLoader = async ({ params }) => {
    const { id } = params;

    const response = await fetch(`http://127.0.0.1:8000/api/v1/products/${id}`);
    console.log(response.data);

    if (!response.ok) {
        throw Error('Could not found product');
    }

    return response.json();
};
