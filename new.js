

const productContainer = document.getElementById('product-container');
const productButtons = document.querySelector('.menu');
const filterInput = document.getElementById('filter');

let laptops = [];


async function fetchProductData() {
  try {
    const response = await fetch('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const productElements = doc.querySelectorAll('.thumbnail');

    laptops = Array.from(productElements).map(productElement => {
      const caption = productElement.querySelector('.caption').textContent.trim();
      const imgSrc = productElement.querySelector('img').getAttribute('src');

      const ramPattern = /(\d+GB)/;
      const processorPattern = /([A-Za-z]+ \w+\d+)/;

      const ramMatch = caption.match(ramPattern);
      const processorMatch = caption.match(processorPattern);

      return {
        ram: ramMatch ? ramMatch[1] : 'Not found',
        processor: processorMatch ? processorMatch[0] : 'Not found',
        image: imgSrc.startsWith('http') ? imgSrc : `https://webscraper.io${imgSrc}`,
      };
    });

    console.log('Laptops:', laptops);

    const categories = ['All', ...new Set(laptops.map(product => product.ram))];
    console.log('Categories:', categories); 
    addCategoryButtons(categories);
    FetchProducts(laptops);

  } catch (error) {
    console.error('Error:', error);
  }
}

function FetchProducts(laptops) {
  productContainer.innerHTML = '';

  laptops.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('single-item');

    const productImg = document.createElement('div');
    productImg.classList.add('product-img');
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.processor;
    productImg.appendChild(img);

    const titleWrap = document.createElement('div');
    titleWrap.classList.add('title-wrap');

    const title = document.createElement('h3');
    title.classList.add('title');
    title.textContent = product.processor;

    titleWrap.appendChild(title);

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = product.ram;

  
    productItem.appendChild(productImg);
    productItem.appendChild(titleWrap);
    productItem.appendChild(category) ; 
    productContainer.appendChild(productItem);
  });
}

function categoryButton(category, onClick) {
  const button = document.createElement('button');
  button.classList.add('product-links');
  button.textContent = category;
  button.addEventListener('click', onClick);
  return button;
}

function addCategoryButtons(categories) {
  productButtons.innerHTML = ''; 
  categories.forEach(category => {
    const button = categoryButton(category, () => {
      FetchProducts(category === 'All' ? laptops : laptops.filter(product => product.ram === category));
    });
    productButtons.appendChild(button);
  });
}





fetchProductData();

filterInput.addEventListener('keyup', (e) => {
  const text = e.target.value.toLowerCase();
  if (laptops) { 
    FetchProducts(laptops.filter(product => product.ram.toLowerCase().includes(text)));
  }
});
