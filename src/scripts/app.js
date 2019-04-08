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
        console.log(cart);
        // add cart to storage
        Storage.saveCart(cart);
        //set cart values, displat paiting in cart
        // show cart etc
      });
    });
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const paintings = new Paintings();
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

// 201
// console.log(paintingsDOM);
// const kek = "exported?";
// export { cartOverlay };
