let totalPrice = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createTotalPriceElement() {
  const totalDiv = document.createElement('div');
  const totalPriceLabel = document.createElement('span');
  const totalPriceEl = document.createElement('span');

  totalDiv.className = 'total-price-div';
  totalPriceLabel.textContent = 'Total: $';
  totalPriceEl.className = 'total-price';
  totalPriceEl.textContent = totalPrice;
  totalDiv.appendChild(totalPriceLabel);
  totalDiv.appendChild(totalPriceEl);

  document
    .querySelector('.cart')
    .insertBefore(totalDiv, document.querySelector('.empty-cart'));
}

function addTotalPrice() {
  document
    .querySelector('.total-price')
    .textContent = parseFloat(totalPrice.toFixed(2));
}

function updateLocalStorage() {
  saveCartItems(document.querySelector('.cart__items').innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  const itemPriceStr = event.target.textContent.match(/\$\d*\.?\d*/)[0];
  const itemPriceNumber = parseFloat(itemPriceStr.replace('$', ''));
  totalPrice -= itemPriceNumber;
  addTotalPrice();
  updateLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const data = await fetchItem(sku);
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  totalPrice += data.price;
  addTotalPrice();

  document
    .querySelector('ol.cart__items')
    .appendChild(createCartItemElement(obj));

  updateLocalStorage();
}

function getLocalStorage() {
  const cartHTML = getSavedCartItems();
  const cartItems = document.querySelector('ol.cart__items');
  cartItems.innerHTML = cartHTML;
  cartItems.childNodes.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
    const itemPriceStr = li.textContent.match(/\$\d*\.?\d*/)[0];
    const itemPriceNumber = parseFloat(itemPriceStr.replace('$', ''));
    totalPrice += itemPriceNumber;
  });
  addTotalPrice();
}

function emptyCart() {
  document.querySelectorAll('.cart__item').forEach((li) => {
    li.click();
  });
  addTotalPrice();
}

function startLoading() {
  const loadingText = document.createElement('p');
  loadingText.className = 'loading';
  loadingText.textContent = 'carregando...';
  document.querySelector('.items').appendChild(loadingText);
}

function stopLoading() {
  document.querySelector('.loading').remove();
}

function displayProducts(data) {
  stopLoading();
  data.results.forEach((item) => {
    const obj = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };

    document
      .querySelector('.items')
      .appendChild(createProductItemElement(obj));
    });
}

window.onload = async () => {
  startLoading();
  await fetchProducts('computador').then(displayProducts);
  createTotalPriceElement();

  document
    .querySelectorAll('.item__add')
    .forEach((button) => button.addEventListener('click', addItemToCart));

  document
    .querySelector('.empty-cart')
    .addEventListener('click', emptyCart);

  getLocalStorage();
};
