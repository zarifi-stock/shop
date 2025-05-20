document.addEventListener("DOMContentLoaded", () => {
  // Replace with your published Google Sheet ID and sheet name
  const sheetId = "1UTrtRDOQLCZ985NClMTFFtOg1EUngAZ2DdijHK1TLtU"
  const sheetName = "rabida"

  // URL for the published Google Sheet in CSV format
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`

  // Elements
  const productsGrid = document.getElementById("products-grid")
  const productSelect = document.getElementById("product")
  const loadingElement = document.getElementById("loading")

  // Fetch products from Google Sheet
  fetchProducts()

  async function fetchProducts() {
    try {
      const response = await fetch(sheetUrl)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const csvData = await response.text()
      const products = parseCSV(csvData)

      if (products.length > 0) {
        displayProducts(products)
        populateProductSelect(products)
        loadingElement.style.display = "none"
      } else {
        loadingElement.textContent = "No products found."
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      loadingElement.textContent = "Error loading products. Please try again later."
    }
  }

  function parseCSV(csvText) {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((header) => header.trim().replace(/^"|"$/g, ""))

    const products = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      // Handle commas within quoted fields
      const currentLine = lines[i]
      const values = []
      let inQuotes = false
      let currentValue = ""

      for (let j = 0; j < currentLine.length; j++) {
        const char = currentLine[j]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim().replace(/^"|"$/g, ""))
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      values.push(currentValue.trim().replace(/^"|"$/g, ""))

      const product = {}
      headers.forEach((header, index) => {
        product[header] = values[index] || ""
      })

      products.push(product)
    }

    return products
  }

  function displayProducts(products) {
    productsGrid.innerHTML = ""

    products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card bg-white shadow rounded-lg overflow-hidden"

      // Create a placeholder with product name
      const placeholderUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`

      // Get image URL from product data
      let imageUrl = placeholderUrl
      if (product.image && product.image.trim() !== "") {
        // Clean up the URL if needed (remove quotes, trim whitespace)
        imageUrl = product.image.trim().replace(/^"|"$/g, "")

        // Check if it's an Imgur URL
        const isImgur = imageUrl.includes("imgur.com")

        // If the URL doesn't start with http/https, assume it's a relative URL
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
          imageUrl = "https://" + imageUrl
        }

        // Add warning for Imgur URLs
        if (isImgur) {
          console.log(`Imgur image detected for ${product.name}. Imgur may have capacity issues.`)
        }
      }

      // Create image container with loading state
      const imageContainer = document.createElement("div")
      imageContainer.className = "relative"

      // Create image element
      const img = document.createElement("img")
      img.src = imageUrl
      img.alt = product.name
      img.className = "product-image w-full"

      // Add loading indicator
      const loadingIndicator = document.createElement("div")
      loadingIndicator.className = "absolute inset-0 flex items-center justify-center bg-gray-100"
      loadingIndicator.innerHTML = '<p class="text-gray-500">Loading image...</p>'

      // Add error handling
      img.onerror = function () {
        this.onerror = null
        this.src = placeholderUrl

        // Create error message overlay
        const errorOverlay = document.createElement("div")
        errorOverlay.className =
          "absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-80 text-white text-xs p-1 text-center"
        errorOverlay.textContent = "Image unavailable"

        // Replace loading indicator with error overlay
        this.parentNode.removeChild(loadingIndicator)
        this.parentNode.appendChild(errorOverlay)
      }

      // Remove loading indicator when image loads
      img.onload = function () {
        if (this.parentNode && this.parentNode.contains(loadingIndicator)) {
          this.parentNode.removeChild(loadingIndicator)
        }
      }

      // Add elements to image container
      imageContainer.appendChild(img)
      imageContainer.appendChild(loadingIndicator)

      // Create product info container
      const infoContainer = document.createElement("div")
      infoContainer.className = "p-4"
      infoContainer.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
        <p class="text-gray-600 mb-2">${product.price}</p>
        <p class="text-sm text-gray-500">${product.description || "No description available."}</p>
        <button class="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors add-to-order" 
                data-product="${product.name}" data-price="${product.price}">
          Add to Order
        </button>
      `

      // Add containers to product card
      productCard.appendChild(imageContainer)
      productCard.appendChild(infoContainer)
      productsGrid.appendChild(productCard)

      // Add event listener to the "Add to Order" button
      const addButton = productCard.querySelector(".add-to-order")
      addButton.addEventListener("click", () => {
        document.getElementById("product").value = product.name
        document.getElementById("order").scrollIntoView({ behavior: "smooth" })
      })
    })
  }

  function populateProductSelect(products) {
    productSelect.innerHTML = '<option value="">Select a product</option>'

    products.forEach((product) => {
      const option = document.createElement("option")
      option.value = product.name
      option.textContent = `${product.name} - ${product.price}`
      productSelect.appendChild(option)
    })
  }

  // Form submission handling
  const orderForm = document.getElementById("order-form")

  orderForm.addEventListener("submit", (e) => {
    // You can add additional validation here if needed
    // Formspree will handle the actual form submission
  })
})
