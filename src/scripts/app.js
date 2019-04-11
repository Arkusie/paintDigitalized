import {
  paintingsDOM,
  cartContent,
  aboutDIV,
  aboutBtn,
  closeAbout,
  cartTotal,
  cartCounter,
  cartBtn,
  closeCartBtn,
  clearCartBtn,
  cartDOM,
  cartOverlay,
  DigitalizeDIV,
  closeDigitalize,
  Digitalize
} from "./selectors";
import { Storage } from "./storage";
import { Paintings } from "./Paintings";
//
let cart = [];
let buttonsDOM = [];
// menu
closeDigitalize.addEventListener("click", toggleDigitalize);
Digitalize.addEventListener("click", toggleDigitalize);
function toggleDigitalize() {
  DigitalizeDIV.classList.toggle("visibilityOn");
  aboutDIV.classList.remove("visibilityOn");
}

closeAbout.addEventListener("click", toggleAbout);
aboutBtn.addEventListener("click", toggleAbout);
function toggleAbout() {
  aboutDIV.classList.toggle("visibilityOn");
  DigitalizeDIV.classList.remove("visibilityOn");
}
// getting the data using async await, later applying contentful
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
        button.innerText = "in the cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        console.log(event);
        event.target.innerText = "in the cart";
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
        // this.showCart();
      });
    });
  }
  setCartValue(cart) {
    let tempTotalprice = 0;
    let paintingsAmount = 0;
    cart.map(painting => {
      tempTotalprice += painting.price * painting.amount;
      paintingsAmount += painting.amount;
      // console.log(tempTotalprice);
    });

    cartTotal.innerText = parseFloat(tempTotalprice.toFixed(2)) + " $";
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
      <span class="remove-painting" data-id=${painting.id}>remove</span>
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
  cartFunctions() {
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", event => {
      // console.log(event.target);
      if (event.target.classList.contains("remove-painting")) {
        let removePainting = event.target;
        console.log(removePainting);
        let id = removePainting.dataset.id;
        this.removePaintings(id);
        cartContent.removeChild(removePainting.parentElement.parentElement);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let increment = event.target;
        let id = increment.dataset.id;
        let tempPainting = cart.find(painting => painting.id === id);
        tempPainting.amount += 1;
        Storage.saveCart(cart);
        this.setCartValue(cart);
        increment.nextElementSibling.innerText = tempPainting.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let decrement = event.target;
        let id = decrement.dataset.id;
        let tempPainting = cart.find(painting => painting.id === id);
        tempPainting.amount -= 1;
        if (tempPainting.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValue(cart);
          decrement.previousElementSibling.innerText = tempPainting.amount;
        } else {
          cartContent.removeChild(decrement.parentElement.parentElement);
          this.removePaintings(id);
        }
      }
    });
  }

  clearCart() {
    // console.log(this);
    let cartPaintings = cart.map(painting => painting.id);
    cartPaintings.forEach(id => this.removePaintings(id));
    console.log(cartContent.children);

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removePaintings(id) {
    // used for both: single remove and remove all
    cart = cart.filter(painting => painting.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = "add";
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}
//local storage

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
      ui.cartFunctions();
    });
});

// 252
// console.log(paintingsDOM);
// const kek = "exported?";
// export { cartOverlay };
