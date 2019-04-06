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
//
let cart = [];

// getting the data using async await
class Paintings {
  async getPaintings() {
    try {
      let result = fetch("product.json").then(result => result.json());
      let data = await result;
      return data;
    } catch (error) {
      console.log("woops ;(");
    }
  }
}
// displaying the data
class UI {}
//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const paintings = new Paintings();
  //get  the paitings
  paintings.getPaintings().then(data => console.log(data));

  //   console.log("start");
});

// console.log(paintingsDOM);
// const kek = "exported?";
// export { cartOverlay };
