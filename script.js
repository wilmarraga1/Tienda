const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});
/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal1 = document.querySelector('.cart-total');
productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

// Funcion para mostrar  HTML
const showHTML = () => {
    if (!allProducts.length) {
    containerCartProducts.innerHTML=`<p class="cart-empty">El carrito esta Vacio</p> `
    }
    
	// Limpiar HTML
    rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};
//paypal
let cartTotal = 0;
function addItemToCart(price){
cartTotal += price;
   updateCartTotal();
 }
function updateCartTotal(){
       document.getElementById('cart-total').textContent = `R$${cartTotal.toFixed(2)}`
 renderPaypalButton(cartTotal);
 }
function renderPaypalButton(amount) {
   document.getElementById('paypal-button-container').innerHTML = '';

 paypal.Buttons({
      style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: (amount / 100).toFixed(2) 
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
              alert('Transação concluída por ' + details.payer.name.given_name + '!');

            
              fetch('/paypal-transaction-complete', {
                  method: 'post',
                  headers: {
                      'content-type': 'application/json'
                  },
                  body: JSON.stringify({
                      orderID: data.orderID,
                      payerID: data.payerID,
                      paymentDetails: details
                  })
              }).then(function(response) {
                  return response.json();
              }).then(function(data) {
                  console.log('Resposta do servidor:', data);
              }).catch(function(error) {
                  console.error('Erro ao enviar dados para o servidor:', error);
              });
          });
      },
      onError: function(err) {
          console.error('Erro no pagamento:', err);
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
      }
  }).render('#paypal-button-container'); 
}
renderPaypalButton(cartTotal);
