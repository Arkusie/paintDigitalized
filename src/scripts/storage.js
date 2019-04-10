export class Storage {
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
