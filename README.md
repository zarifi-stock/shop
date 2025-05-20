# Simple Shop - Static E-commerce Website

A lightweight e-commerce website that loads product data from Google Sheets and uses Formspree for order processing.

## Features

- Static website that can be hosted on GitHub Pages
- Dynamically loads product information from a Google Sheet
- Responsive design that works on mobile and desktop
- Order form that sends details via Formspree

## Setup Instructions

### 1. Set up your Google Sheet

1. Create a new Google Sheet with the following columns:
   - name (Product Name)
   - price (Product Price)
   - description (Product Description)
   - image (URL to product image)

2. Add your products to the sheet

3. Publish your sheet to the web:
   - File > Share > Publish to web
   - Select "Entire Document" and "CSV" format
   - Click "Publish"
   - Copy the Sheet ID from the URL (the long string between /d/ and /edit in your sheet URL)

4. Update the `sheetId` variable in `app.js` with your Sheet ID
   - If your sheet name is not "Products", update the `sheetName` variable as well

### 2. Set up Formspree

1. Go to [Formspree](https://formspree.io/) and create an account
2. Create a new form and get your form ID
3. Update the form action in `index.html` with your Formspree ID:
   ```html
   <form id="order-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   \`\`\`

### 3. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all the files to your repository
3. Go to Settings > Pages
4. Select the main branch as the source
5. Click Save
6. Your site will be published at `https://yourusername.github.io/repository-name/`

## Customization

- Update the colors and styles in `styles.css`
- Modify the layout in `index.html`
- Add additional functionality in `app.js`

## License

MIT
