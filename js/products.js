// Function to initiate the product loading process
// This is the entry point that starts the data fetching sequence
function requestProducts() {
    // Define the path to the JSON file containing product data
    const jsonFilePath = 'data/products.json';

    // Use fetch() to make an asynchronous HTTP request to retrieve the JSON data
    // fetch() returns a Promise that resolves to a Response object
    fetch(jsonFilePath)
        .then(response => {
            // Check if the HTTP response is successful (status 200-299)
            if (!response.ok) {
                // If not successful, throw an error to be caught by the catch block
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            // Parse the response body as JSON and return another Promise
            return response.json();
        })
        .then(products => {
            // The parsed JSON data (an array of product objects) is passed here
            // Call renderUI() to display the products in the HTML grid
            renderUI(products);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch or JSON parsing
            console.error('Error loading products:', error);
            // Display a user-friendly error message in the product container
            const container = document.getElementById('product-container');
            if (container) {
                container.innerHTML = '<div class="alert alert-danger">Failed to load products. Please try again later.</div>';
            }
        });
}

// Function to render the user interface with the fetched product data
// This function takes the products array and dynamically generates HTML elements
function renderUI(products) {
    // Get the DOM element where products will be displayed
    const container = document.getElementById('product-container');
    if (!container) {
        console.error('Product container not found');
        return;
    }

    // Clear any existing content in the container
    container.innerHTML = '';

    // Iterate through each product in the array
    products.forEach((product, index) => {
        // Generate HTML for star ratings based on the product's rating value
        // Create an array of 5 star elements, filled or empty based on rating
        const stars = Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star ${i < product.rating ? 'text-primary' : ''}"></i>`
        ).join('');

        // Cycle through different animation delays for visual variety
        const delays = ['0.1s', '0.3s', '0.5s'];
        const delay = delays[index % 3];

        // Build the complete HTML structure for a single product item
        // This matches the existing Bootstrap-based product card design
        const productHTML = `
            <div class="col-lg-4">
                <div class="product-item rounded wow fadeInUp" data-wow-delay="${delay}">
                    <div class="product-item-inner border rounded">
                        <div class="product-item-inner-item">
                            <img src="${product.image}" class="img-fluid w-100 rounded-top" alt="${product.name}">
                            ${product.label ? `<div class="product-${product.label.toLowerCase()}">${product.label}</div>` : ''}
                            <div class="product-details">
                                <a href="${product.detailLink}"><i class="fa fa-eye fa-1x"></i></a>
                            </div>
                        </div>
                        <div class="text-center rounded-bottom p-4">
                            <a href="#" class="d-block mb-2">${product.category}</a>
                            <a href="#" class="d-block h4">${product.name.replace(' ', '<br>')}</a>
                            <del class="me-2 fs-5">$${product.oldPrice.toFixed(2)}</del>
                            <span class="text-primary fs-5">$${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
                        <a href="${product.cartLink}" class="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4">
                            <i class="fas fa-shopping-cart me-2"></i> Add To Cart
                        </a>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex">
                                ${stars}
                            </div>
                            <div class="d-flex">
                                <a href="#" class="text-primary d-flex align-items-center justify-content-center me-3">
                                    <span class="rounded-circle btn-sm-square border"><i class="fas fa-random"></i></span>
                                </a>
                                <a href="#" class="text-primary d-flex align-items-center justify-content-center me-0">
                                    <span class="rounded-circle btn-sm-square border"><i class="fas fa-heart"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the generated HTML to the container
        // This builds up the product grid dynamically
        container.innerHTML += productHTML;
    });
}

// Automatically start loading products when the DOM content is fully loaded
// This ensures the HTML elements are available before trying to manipulate them
document.addEventListener('DOMContentLoaded', requestProducts);