// Data persistence
let categories = JSON.parse(localStorage.getItem('categories')) || [
  { name: 'Ceramic', subcategories: ['Glossy', 'Matte'], order: 1 },
  { name: 'Porcelain', subcategories: ['Large Format', 'Subway'], order: 2 }
];

let products = JSON.parse(localStorage.getItem('products')) || [
  { category: 'Ceramic', subcategory: 'Glossy', title: 'Elegant Glossy Tile', description: 'Shiny and durable.', size: '12x12', quality: 'Premium', image: 'https://via.placeholder.com/280x200?text=Ceramic+Glossy+Tile' },
  { category: 'Porcelain', subcategory: 'Matte', title: 'Porcelain Matte Tile', description: 'Durable porcelain matte finish.', size: '24x24', quality: 'Premium', image: 'https://via.placeholder.com/280x200?text=Porcelain+Matte+Tile' }
];

// --- CATEGORY PAGE FUNCTIONS ---
function loadCategoriesPage() {
  const container = document.getElementById('category-list');
  container.innerHTML = '';

  categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.style.padding = '20px';
    catDiv.style.borderBottom = '1px solid #0074D9';
    catDiv.style.cursor = 'pointer';
    catDiv.style.background = '#f9faff';
    catDiv.style.borderRadius = '10px';
    catDiv.style.marginBottom = '15px';
    catDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

    const title = document.createElement('h3');
    title.textContent = cat.name;
    title.style.color = '#001f3f';

    const subcatList = document.createElement('ul');
    subcatList.style.listStyle = 'none';
    subcatList.style.paddingLeft = '20px';
    subcatList.style.display = 'none';

    cat.subcategories.forEach(subcat => {
      const li = document.createElement('li');
      li.textContent = subcat;
      li.style.cursor = 'pointer';
      li.style.fontWeight = '600';
      li.style.color = '#0074D9';
      li.style.padding = '8px 0';
      li.style.borderRadius = '5px';
      li.style.transition = 'background 0.3s';

      li.onclick = () => {
        showProductsByCategorySubcat(cat.name, subcat);
      };

      li.onmouseover = () => {
        li.style.background = '#e6f7ff';
      };

      li.onmouseout = () => {
        li.style.background = 'none';
      };

      subcatList.appendChild(li);
    });

    title.onclick = () => {
      subcatList.style.display = subcatList.style.display === 'none' ? 'block' : 'none';
    };

    catDiv.appendChild(title);
    catDiv.appendChild(subcatList);
    container.appendChild(catDiv);
  });

  // Products container
  const prodContainer = document.createElement('div');
  prodContainer.id = 'product-list-subcat';
  prodContainer.style.marginTop = '30px';
  container.appendChild(prodContainer);
}

function showProductsByCategorySubcat(catName, subcatName) {
  const container = document.getElementById('product-list-subcat');
  container.innerHTML = `<h3 style="color:#001f3f; font-family:'Playfair Display', serif;">
    Products for ${catName} &gt; ${subcatName}
  </h3>`;

  const filtered = products.filter(p => p.category === catName && p.subcategory === subcatName);

  if (filtered.length === 0) {
    container.innerHTML += '<p>No products found for this subcategory.</p>';
    return;
  }
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
  grid.style.gap = '20px';

  filtered.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'product-grid-item';
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.title}" />
      <h4>${prod.title}</h4>
      <p>${prod.description}</p>
      <p><b>Size:</b> ${prod.size} | <b>Quality:</b> ${prod.quality}</p>
      <button class="inquiry-btn" onclick="openWhatsApp('${prod.title}', '${prod.size}', '${prod.quality}', '${prod.image}')">Inquiry</button>
    `;
    grid.appendChild(div);
  });
  container.appendChild(grid);
}

// --- PRODUCTS PAGE FUNCTIONS ---
function loadProductsPage() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  // Sort categories by order
  categories.sort((a, b) => a.order - b.order);

  categories.forEach(cat => {
    // Category header
    const catHeader = document.createElement('h3');
    catHeader.textContent = cat.name;
    catHeader.style.color = '#001f3f';
    catHeader.style.fontFamily = "'Playfair Display', serif";
    catHeader.style.marginTop = '40px';
    catHeader.style.textAlign = 'center';
    container.appendChild(catHeader);

    // Subcategories and products
    cat.subcategories.forEach(subcat => {
      const subHeader = document.createElement('h4');
      subHeader.textContent = subcat;
      subHeader.style.color = '#0074D9';
      subHeader.style.marginTop = '20px';
      subHeader.style.textAlign = 'center';
      container.appendChild(subHeader);

      const filteredProducts = products.filter(p => p.category === cat.name && p.subcategory === subcat);

      if (filteredProducts.length === 0) {
        const noProd = document.createElement('p');
        noProd.textContent = 'No products available.';
        noProd.style.textAlign = 'center';
        container.appendChild(noProd);
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'product-grid';

      filteredProducts.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'product-grid-item';
        div.innerHTML = `
          <img src="${prod.image}" alt="${prod.title}" />
          <h4>${prod.title}</h4>
          <p>${prod.description}</p>
          <p><b>Size:</b> ${prod.size} | <b>Quality:</b> ${prod.quality}</p>
          <button class="inquiry-btn" onclick="openWhatsApp('${prod.title}', '${prod.size}', '${prod.quality}', '${prod.image}')">Inquiry</button>
        `;
        grid.appendChild(div);
      });
      container.appendChild(grid);
    });
  });
}

// --- GALLERY PAGE FUNCTIONS ---
function loadGalleryPage() {
  const container = document.getElementById('gallery-grid');
  container.innerHTML = '';

  products.forEach(prod => {
    const img = document.createElement('img');
    img.src = prod.image;
    img.alt = prod.title;
    container.appendChild(img);
  });
}

// --- WHATSAPP INQUIRY FUNCTION ---
function openWhatsApp(title, size, quality, image) {
  const message = encodeURIComponent(`Hi, I'm interested in this product:\n\nTitle: ${title}\nSize: ${size}\nQuality: ${quality}\nImage: ${image}\n\nPlease provide more details.`);
  const url = `https://wa.me/1234567890?text=${message}`; // Replace 1234567890 with your WhatsApp number
  window.open(url, '_blank');
}

// --- ADMIN PAGE FUNCTIONS ---

let cropper;
let currentImageInput;

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadAdminDashboard();
  }
});

function adminLogin() {
  const pass = document.getElementById('admin-password').value;
  const message = document.getElementById('login-message');

  if (pass === 'itz1234') { // Change password in production
    localStorage.setItem('adminLoggedIn', 'true');
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    message.textContent = '';
    loadAdminDashboard();
  } else {
    message.textContent = 'Incorrect password.';
  }
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('admin-password').value = '';
}

function loadAdminDashboard() {
  updateCategoryAdminList();
  populateCategorySelect();
  updateProductAdminList();
  populateProductCategoryDropdown();
}

function updateCategoryAdminList() {
  const ul = document.getElementById('category-list-admin');
  ul.innerHTML = '';
  categories.forEach((cat, i) => {
    const li = document.createElement('li');
    li.textContent = `${cat.name} (Order: ${cat.order})`;

    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.onclick = () => {
      categories.splice(i, 1);
      localStorage.setItem('categories', JSON.stringify(categories));
      updateCategoryAdminList();
      populateCategorySelect();
      populateProductCategoryDropdown();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function populateCategorySelect() {
  const select = document.getElementById('cat-select');
  select.innerHTML = '';
  categories.forEach((cat, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

function addCategory() {
  const input = document.getElementById('new-cat');
  const orderInput = document.getElementById('new-cat-order');
  const name = input.value.trim();
  const order = parseInt(orderInput.value.trim()) || 1;
  if (name) {
    categories.push({name, subcategories: [], order});
    localStorage.setItem('categories', JSON.stringify(categories));
    input.value = '';
    orderInput.value = '';
    updateCategoryAdminList();
    populateCategorySelect();
    populateProductCategoryDropdown();
  } else {
    alert('Enter Category Name');
  }
}

function addSubcategory() {
  const select = document.getElementById('cat-select');
  const newSub = document.getElementById('new-sub').value.trim();
  if (newSub) {
    categories[select.value].subcategories.push(newSub);
    localStorage.setItem('categories', JSON.stringify(categories));
    document.getElementById('new-sub').value = '';
    alert(`Subcategory "${newSub}" added to ${categories[select.value].name}`);
  } else {
    alert('Enter Subcategory Name');
  }
}

function updateProductAdminList() {
  const ul = document.getElementById('product-list-admin');
  ul.innerHTML = '';
  products.forEach((prod, i) => {
    const li = document.createElement('li');
    li.textContent = `${prod.title} (${prod.category} / ${prod.subcategory})`;

    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.onclick = () => {
      products.splice(i, 1);
      localStorage.setItem('products', JSON.stringify(products));
      updateProductAdminList();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function populateProductCategoryDropdown() {
  const select = document.getElementById('prod-cat');
  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.name;
    option.textContent = cat.name;
    select.appendChild(option);
  });
  updateSubcategoryDropdown();
}

function updateSubcategoryDropdown() {
  const catSelect = document.getElementById('prod-cat');
  const subSelect = document.getElementById('prod-sub');
  const category = categories.find(c => c.name === catSelect.value);
  subSelect.innerHTML = '';

  if(category && category.subcategories.length > 0){
    category.subcategories.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub;
      option.textContent = sub;
      subSelect.appendChild(option);
    });
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '--None--';
    subSelect.appendChild(option);
  }
}

function addProduct() {
  const cat = document.getElementById('prod-cat').value.trim();
  const sub = document.getElementById('prod-sub').value.trim();
  const title = document.getElementById('prod-title').value.trim();
  const description = document.getElementById('prod-desc').value.trim();
  const size = document.getElementById('prod-size').value.trim();
  const quality = document.getElementById('prod-quality').value.trim();
  const image = document.getElementById('prod-image').value.trim();

  if (!title || !image) {
    alert('Please enter product title and upload an image.');
    return;
  }

  products.push({category: cat, subcategory: sub, title, description, size, quality, image});
  localStorage.setItem('products', JSON.stringify(products));
  alert('Product added!');
  updateProductAdminList();

  // Clear Inputs
  document.getElementById('prod-title').value = '';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-size').value = '';
  document.getElementById('prod-quality').value = '';
  document.getElementById('prod-image').value = '';
  document.getElementById('prod-image-file').value = '';
}

// --- Image cropper functionality ---

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const modal = document.getElementById('crop-modal');
    const img = document.getElementById('crop-image');
    img.src = e.target.result;
    modal.style.display = 'flex';
    currentImageInput = document.getElementById('prod-image');

    if(cropper){
      cropper.destroy();
    }
    cropper = new Cropper(img, {
      aspectRatio: 1,
      viewMode: 1,
      responsive: true,
      dragMode: 'move'
    });
  };
  reader.readAsDataURL(file);
}

function closeCropModal() {
  const modal = document.getElementById('crop-modal');
  modal.style.display = 'none';
  if(cropper){
    cropper.destroy();
    cropper = null;
  }
}

function saveCroppedImage() {
  if(cropper) {
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingQuality: 'high'
    });
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    currentImageInput.value = croppedDataUrl;
    closeCropModal();
  }

}
