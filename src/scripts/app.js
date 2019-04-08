// selecting elements

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartCounter = document.querySelector(".cart-counter");
const cartTotal = document.querySelector(".cart-total");

const cartContent = document.querySelector(".cart-content");
const paintingsDOM = document.querySelector(".paintings-div");
// the cart
let cart = [];
//
let buttonsDOM = [];

// getting the data using async await
class Paintings {
  async getPaintings() {
    try {
      let result = fetch("product.json").then(result => result.json());
      let data = await result;
      // maping throught every paiting to get some props
      let products = data.items;
      products = products.map(item => {
        const { id } = item.sys;
        const { title, price } = item.fields;
        const image = item.fields.image.fields.file.url;
        return { id, title, price, image };
      });
      return products;
    } catch (error) {
      console.log("woops ;(");
    }
  }
}
// displaying the data
class UI {
  displayPaitings(paintingsData) {
    // console.log(paintingsData);

    let templateResult = "";
    paintingsData.forEach(painting => {
      templateResult += `
      <article class="painting">
      <div class="img-container">
        <img src=${painting.image} alt="paiting nr ${painting.id}" class="paiting-img" />
        <button class="add-btn" data-id=${painting.id}>add</button>
      </div>
      <h3>${painting.title}</h3>
      <h4>${painting.price}$</h4>
    </article>`;
    });
    paintingsDOM.innerHTML = templateResult;
  }
  getAddButtons() {
    // spread operator converts nodelist into array
    const CartAddButtons = [...document.querySelectorAll(".add-btn")];
    // setup buttons array in order to find proper button later on
    buttonsDOM = CartAddButtons;
    // console.log(CartAddButtons);
    CartAddButtons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "in cart?";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        console.log(event);
        event.target.innerText = "painting in the cart";
        event.target.disabled = true;
        // how to rarget before element to change text? hmm
        console.log("find out how to target pseudo class");
        //  get paitings from storage, spread operator to get all the velues&props
        let cartPainting = { ...Storage.getSinglePainting(id), amount: 1 };
        //add to cart,
        cart = [...cart, cartPainting];

        // add cart to storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValue(cart);
        //displat paiting in cart
        this.addCartPainting(cartPainting);
        // show cart etc
        this.showCart();
      });
    });
  }
  setCartValue(cart) {
    let tempTotalprice = 0;
    let paintingsAmount = 0;
    cart.map(painting => {
      tempTotalprice += painting.price * painting.amount;
      paintingsAmount += painting.amount;
      console.log(tempTotalprice);
    });

    cartTotal.innerText = parseFloat(tempTotalprice.toFixed(2));
    cartCounter.innerHTML = paintingsAmount;
  }
  addCartPainting(painting) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${painting.image} alt="a product" class="cart-img" />
    <div>
      <h4>${painting.title}</h4>
      <h5>${painting.price} $</h5>
      <span class="remove-paiting" data-id=${painting.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${painting.id}></i>
      <p class="painting-quantity">${painting.amount}</p>
      <i class="fas fa-chevron-down" data-id=${painting.id}></i>
    </div>
    `;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("visibilityOn");
    console.log("clas added ?");
  }
  hideCart() {
    cartOverlay.classList.remove("visibilityOn");
  }
  setupApp() {
    cart = Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(painting => this.addCartPainting(painting));
  }
}
//local storage
class Storage {
  static savePaintings(paintings) {
    localStorage.setItem("paintings", JSON.stringify(paintings));
  }
  static getSinglePainting(id) {
    let paintings = JSON.parse(localStorage.getItem("paintings"));
    return paintings.find(painting => painting.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    //if there is something in storage, return it parsed if not, empty array
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const paintings = new Paintings();
  //setup app - get items from local storage if there are any, setup listeners
  ui.setupApp();
  //get  the paitings
  paintings
    .getPaintings()
    .then(paintingsData => {
      ui.displayPaitings(paintingsData);
      // saving on local storage using static method of a class
      Storage.savePaintings(paintingsData);
    })
    .then(() => {
      ui.getAddButtons();
    });
});

// 221
// console.log(paintingsDOM);
// const kek = "exported?";
// export { cartOverlay };
