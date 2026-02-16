// Initialize Supabase client
const { createClient } = supabase;
const db = createClient('https://muvprlsaokswtvuzxnoo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dnBybHNhb2tzd3R2dXp4bm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MzA3MDIsImV4cCI6MjA4NTUwNjcwMn0.A5Z2EJ9JojIYLmHzBHlHHnO1Y-POuR6JBeWjv3WVotc');

function openProductPage(id) {
  window.location.href = `product.html?id=${id}`;
}

// Data persistence (now from Supabase)
let categories = [];
let products = [];
let currentBrand = localStorage.getItem("selectedBrand") || "Irfan Tiles Zone";


function setBrand(brand) {
  currentBrand = brand;
  localStorage.setItem("selectedBrand", brand);

  updateBrandUI();
  location.reload();
}
function updateBrandUI() {
  const itzBtn = document.getElementById("brand-itz");
  const tuffBtn = document.getElementById("brand-tuff");

  if (!itzBtn || !tuffBtn) return;

  itzBtn.classList.remove("active-brand");
  tuffBtn.classList.remove("active-brand");

  if (currentBrand === "Irfan Tiles Zone") {
    itzBtn.classList.add("active-brand");
  } else {
    tuffBtn.classList.add("active-brand");
  }
}




async function loadData() {
  try {

    // 🔥 LOAD ALL CATEGORIES (no brand filter)
    const { data: cats, error: catErr } = await db
      .from("categories")
      .select("*")
      .order("order");

    // 🔥 LOAD ALL PRODUCTS (no brand filter)
    const { data: prods, error: prodErr } = await db
      .from("products")
      .select("*");

    if (catErr || prodErr) {
      console.error("Supabase error:", catErr || prodErr);
      return;
    }

    categories = cats || [];
    products = prods || [];

    if (document.getElementById("product-list")) loadProductsPage();
    if (document.getElementById("gallery-grid")) loadGalleryPage();
    if (document.getElementById("category-list")) loadCategoriesPage();

  } catch (err) {
    console.error("Error loading data:", err);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  updateBrandUI();
  loadData();
});

// --- CATEGORY PAGE FUNCTIONS ---

function loadCategoriesPage() {
  const container = document.getElementById('category-list');
  if (!container) return;

  container.innerHTML = '';

  const brands = [
    "Irfan Tiles Zone",
    "Irfan Brothers Tuff Tile Factory"
  ];

  brands.forEach(brandName => {
    const brandDiv = document.createElement('div');
    brandDiv.style.padding = '20px';
    brandDiv.style.cursor = 'pointer';
    brandDiv.style.background = '#eaf4ff';
    brandDiv.style.borderRadius = '10px';
    brandDiv.style.marginBottom = '15px';
    brandDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    brandDiv.style.fontWeight = 'bold';
    brandDiv.style.fontSize = '18px';
    brandDiv.style.color = '#001f3f';
    brandDiv.textContent = brandName;

    brandDiv.onclick = () => {
      showCategoriesByBrand(brandName);
    };

    container.appendChild(brandDiv);
  });
}


// --- LOAD CATEGORIES FOR SELECTED BRAND ---
function showCategoriesByBrand(brandName) {
  const container = document.getElementById('category-list');
  if (!container) return;

  container.innerHTML = '';

  // Make sure categories exist
  if (!categories || categories.length === 0) {
    container.innerHTML = "<p>No categories found.</p>";
    return;
  }

  const brandCategories = categories.filter(cat => cat.brand === brandName);

  if (brandCategories.length === 0) {
    container.innerHTML = `<p>No categories available for ${brandName}.</p>`;
    return;
  }

  brandCategories.forEach(cat => {

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

    // Safety check for subcategories
    const subcategories = Array.isArray(cat.subcategories) ? cat.subcategories : [];

    subcategories.forEach(subcat => {
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
      subcatList.style.display =
        subcatList.style.display === 'none' ? 'block' : 'none';
    };

    catDiv.appendChild(title);
    catDiv.appendChild(subcatList);
    container.appendChild(catDiv);
  });

  function showProductsByCategorySubcat(catName, subcatName) {

  const container = document.getElementById('product-list-subcat');
  container.innerHTML = `
    <h3 style="color:#001f3f; font-family:'Playfair Display', serif;">
      Products for ${catName} > ${subcatName}
    </h3>
  `;

  // 🔥 IMPORTANT FIX: Include brand filter
  const filtered = products.filter(p =>
    
    p.category === catName &&
    p.subcategory === subcatName
  );

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
      <img src="${prod.image}" 
           alt="${prod.title}" 
           style="cursor:pointer;"
           onclick="openProductPage('${prod.id}')">

      <h4>${prod.title}</h4>
      <p>${prod.description}</p>
      <p><b>Size:</b> ${prod.size} | <b>Quality:</b> ${prod.quality}</p>
      <button class="inquiry-btn"
        onclick="openWhatsApp('${prod.title}', '${prod.size}', '${prod.quality}', '${prod.image}')">
        Inquiry
      </button>
    `;
    grid.appendChild(div);
  });

  container.appendChild(grid);
  }

  // Add product container
  const prodContainer = document.createElement('div');
  prodContainer.id = 'product-list-subcat';
  prodContainer.style.marginTop = '30px';
  container.appendChild(prodContainer);
}


// --- PRODUCTS PAGE FUNCTIONS ---
function loadProductsPage() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  const brands = [
    "Irfan Tiles Zone",
    "Irfan Brothers Tuff Tile Factory"
  ];

  brands.forEach(brandName => {

    // 🔹 Brand Header
    const brandHeader = document.createElement('h2');
    brandHeader.textContent = brandName;
    brandHeader.style.textAlign = "center";
    brandHeader.style.marginTop = "40px";
    brandHeader.style.color = "#001f3f";
    brandHeader.style.fontFamily = "'Playfair Display', serif";
    container.appendChild(brandHeader);

    // 🔹 Filter categories of this brand
    const brandCategories = categories
      .filter(cat => cat.brand === brandName)
      .sort((a, b) => a.order - b.order);

    brandCategories.forEach(cat => {

      const catHeader = document.createElement('h3');
      catHeader.textContent = cat.name;
      catHeader.style.color = '#001f3f';
      catHeader.style.marginTop = '30px';
      catHeader.style.textAlign = 'center';
      container.appendChild(catHeader);

      cat.subcategories.forEach(subcat => {

        const subHeader = document.createElement('h4');
        subHeader.textContent = subcat;
        subHeader.style.color = '#0074D9';
        subHeader.style.marginTop = '20px';
        subHeader.style.textAlign = 'center';
        container.appendChild(subHeader);

        // 🔹 Filter products by brand + category + subcategory
        const filteredProducts = products.filter(p =>
          p.brand === brandName &&
          p.category === cat.name &&
          p.subcategory === subcat
        );

        if (filteredProducts.length === 0) {
          return;
        }

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        filteredProducts.forEach(prod => {
          const div = document.createElement('div');
          div.className = 'product-grid-item';
          div.innerHTML = `
            <img src="${prod.image}" 
                 alt="${prod.title}" 
                 style="cursor:pointer;"
                 onclick="openProductPage('${prod.id}')">

            <h4>${prod.title}</h4>
            <p>${prod.description}</p>
            <p><b>Size:</b> ${prod.size} | <b>Quality:</b> ${prod.quality}</p>
            <button class="inquiry-btn"
              onclick="openWhatsApp('${prod.title}', '${prod.size}', '${prod.quality}', '${prod.image}')">
              Inquiry
            </button>
          `;
          grid.appendChild(div);
        });

        container.appendChild(grid);
      });
    });
  });
}


// --- GALLERY PAGE FUNCTIONS ---
function loadGalleryPage() {
  const container = document.getElementById('gallery-grid');
  container.innerHTML = '';

  if (!products || !products.length) return;

  // Shuffle all products randomly
  const shuffled = [...products].sort(() => Math.random() - 0.5);

  shuffled.forEach(prod => {
    const img = document.createElement('img');
    img.src = prod.image;
    img.alt = prod.title;
    img.style.cursor = "pointer";

    img.onclick = () => openProductPage(prod.id);

    container.appendChild(img);
  });
}


// --- WHATSAPP INQUIRY FUNCTION ---
function openWhatsApp(title, size, quality, image) {
  const message = encodeURIComponent(`Hi, I'm interested in this product:\n\nTitle: ${title}\nSize: ${size}\nQuality: ${quality}\nImage: ${image}\n\nPlease provide more details.`);
  const url = `https://wa.me/+923038188816?text=${message}`; // Replace 1234567890 with your WhatsApp number
  window.open(url, '_blank');
}

// --- ADMIN PAGE FUNCTIONS ---

let cropper;
let currentImageInput;

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {

  const loginSection = document.getElementById('login-section');
  const adminDashboard = document.getElementById('admin-dashboard');

  // Only run this logic IF we are on admin page
  if (loginSection && adminDashboard) {

    if (localStorage.getItem('adminLoggedIn') === 'true') {
      loginSection.style.display = 'none';
      adminDashboard.style.display = 'block';
      loadAdminDashboard();
    }

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

async function loadAdminDashboard() {
  await loadData(); // Reload data from Supabase
  updateCategoryAdminList();
  populateCategorySelect();
  updateProductAdminList();
  populateProductCategoryDropdown();
}

function updateCategoryAdminList() {
  const ul = document.getElementById('category-list-admin');
  ul.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>${cat.name}</strong> (Order: ${cat.order})
      <br>
      Subcategories:
      ${(cat.subcategories || []).map((sub, index) =>
        `<span onclick="editSubcategoryById('${cat.id}', ${index})"
        style="cursor:pointer; color:blue;">${sub}</span>`
      ).join(", ") || "None"}
      <br>
    `;

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editCategory(cat);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.onclick = async () => {
      await db.from("categories").delete().eq("id", cat.id);
      location.reload();
    };

    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    ul.appendChild(li);
  });
}

async function addSubcategory() {
  const select = document.getElementById('cat-select');
  const newSub = document.getElementById('new-sub').value.trim();

  if (!newSub) {
    alert("Enter Subcategory Name");
    return;
  }

  const cat = categories[select.value];
  const updatedSubs = [...(cat.subcategories || []), newSub];

  await db.from("categories")
    .update({ subcategories: updatedSubs })
    .eq("id", cat.id);

  document.getElementById('new-sub').value = '';
  location.reload();

}


function editSubcategoryById(catId, index) {
  const cat = categories.find(c => c.id === catId);
  editSubcategory(cat, index);
}


async function editCategory(cat) {
  const newName = prompt("Edit Category Name:", cat.name);
  if (!newName) return;

  let newOrder = parseInt(prompt("Edit Order:", cat.order));

  if (!newOrder || newOrder <= 0) {
    alert("Invalid order");
    return;
  }

  // Check used orders
  const { data: existing } = await db
    .from("categories")
    .select("order")
    .eq("brand", currentBrand);

  const usedOrders = existing
    .filter(c => c.order !== cat.order)
    .map(c => c.order);

  while (usedOrders.includes(newOrder)) {
    newOrder++;
  }

  await db.from("categories")
    .update({
      name: newName,
      order: newOrder
    })
    .eq("id", cat.id);

  location.reload();
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

async function addCategory() {
  const nameInput = document.getElementById("new-cat");
  const orderInput = document.getElementById("new-cat-order");

  const name = nameInput.value.trim();
  let order = parseInt(orderInput.value);

  if (!name) {
    alert("Enter category name");
    return;
  }

  // GET existing orders safely
  const response = await db
    .from("categories")
    .select("order")
    .eq("brand", currentBrand);

  const existing = response.data || [];

  const usedOrders = existing.map(c => c.order);

  while (usedOrders.includes(order)) {
    order++;
  }

  const insertResponse = await db.from("categories").insert({
    brand: currentBrand,
    name: name,
    subcategories: [],
    order: order
  });

  if (insertResponse.error) {
    console.error(insertResponse.error);
    alert("Insert failed. Check console.");
    return;
  }

  nameInput.value = "";
  orderInput.value = "";

  location.reload();
}


async function editSubcategory(cat, subIndex) {

  const newName = prompt("Edit Subcategory:", cat.subcategories[subIndex]);

  if (!newName) {
    alert("Enter Subcategory Name");
    return;
  }

  const updatedSubs = [...cat.subcategories];
  updatedSubs[subIndex] = newName;

  await db.from("categories")
    .update({ subcategories: updatedSubs })
    .eq("id", cat.id);

  location.reload();
}


function updateProductAdminList() {
  const ul = document.getElementById('product-list-admin');
  ul.innerHTML = '';

  products.forEach((prod, i) => {
    const li = document.createElement('li');

    // 🔥 Make list item horizontal
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.gap = "10px";

    // LEFT SIDE (Image + Text)
    const leftDiv = document.createElement('div');
    leftDiv.style.display = "flex";
    leftDiv.style.alignItems = "center";
    leftDiv.style.gap = "10px";

    // 🖼 Product Image
    const img = document.createElement('img');
    img.src = prod.image;
    img.width = 50;
    img.height = 50;
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";

    // 📦 Product Title
    const textSpan = document.createElement('span');
    textSpan.textContent = `${prod.title} (${prod.category} / ${prod.subcategory})`;

    leftDiv.appendChild(img);
    leftDiv.appendChild(textSpan);

    // ❌ Remove Button (UNCHANGED LOGIC)
    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.onclick = async () => {
      try {
        const { error } = await db.from('products').delete().eq('id', prod.id);
        if (error) throw error;
        await loadData();
        updateProductAdminList();
      } catch (err) {
        alert('Error removing product: ' + err.message);
      }
    };

    li.appendChild(leftDiv);
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

async function addProduct() {
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

  try {
    const { error } = await db.from('products').insert([{
      brand: currentBrand,
      category: cat,
      subcategory: sub,
      title,
      description,
      size,
      quality,
      image
    }]);

    if (error) throw error;

    alert('Product added!');
    await loadData();
    updateProductAdminList();

    document.getElementById('prod-title').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-size').value = '';
    document.getElementById('prod-quality').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-image-file').value = '';

  } catch (err) {
    alert('Error adding product: ' + err.message);
  }
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

async function saveCroppedImage() {
  if(cropper) {
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingQuality: 'high'
    });
    canvas.toBlob(async (blob) => {
      try {
        const fileName = `tile-${Date.now()}.jpg`;
        const { data, error } = await db.storage.from('tiles').upload(fileName, blob);
        if (error) throw error;
        const { data: urlData } = db.storage.from('tiles').getPublicUrl(fileName);
        currentImageInput.value = urlData.publicUrl;
        closeCropModal();
      } catch (err) {
        alert('Error uploading image: ' + err.message);
      }
    });
  }
}


async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const { data: product } = await db
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return;

  const container = document.getElementById("product-detail");

  container.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:30px;">
      <img src="${product.image}" 
           style="max-width:400px; width:100%; border-radius:10px;">

      <div>
        <h2>${product.title}</h2>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Subcategory:</strong> ${product.subcategory}</p>
        <p><strong>Size:</strong> ${product.size}</p>
        <p><strong>Quality:</strong> ${product.quality}</p>
        <p>${product.description}</p>

        <button 
          class="inquiry-btn"
          onclick="openWhatsApp('${product.title}', '${product.size}', '${product.quality}', '${product.id}')">
          Inquire on WhatsApp
        </button>
      </div>
    </div>
  `;

  loadSimilarProducts(product);
}

// --- WHATSAPP FUNCTION ---
function openWhatsApp(title, size, quality, productId) {

  const productUrl = window.location.origin + "/ITZ Catalog/product.html?id=" + productId;

  const message =
    "Hi, I'm interested in this product:\n\n" +
    "Title: " + title + "\n" +
    "Size: " + size + "\n" +
    "Quality: " + quality + "\n\n" +
    "Product Link: " + productUrl;

  const encodedMessage = encodeURIComponent(message);

  const whatsappNumber = "923038188816"; // your number without +
  const whatsappLink = "https://wa.me/" + whatsappNumber + "?text=" + encodedMessage;

  window.open(whatsappLink, "_blank");
}



async function loadSimilarProducts(product) {
  let { data: similar } = await db
    .from("products")
    .select("*")
    .eq("subcategory", product.subcategory)
    .neq("id", product.id);

  if (!similar.length) {
    const { data: fallback } = await db
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id);

    similar = fallback;
  }

  const container = document.getElementById("similar-products");

  similar.slice(0, 4).forEach(prod => {
    const div = document.createElement("div");
    div.className = "product-grid-item";
    div.innerHTML = `
      <img src="${prod.image}" 
           style="cursor:pointer;"
           onclick="openProductPage('${prod.id}')">
      <h4>${prod.title}</h4>
    `;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadProductDetail);

const loader = document.getElementById("loader");
if (loader) loader.style.display = "none";


document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".product-grid-item").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

