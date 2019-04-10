import { client } from "./contentful";

export class Paintings {
  async getPaintings() {
    try {
      let contentful = await client.getEntries({
        content_type: "paintDigitalizedPaintings"
      });

      // let result = fetch("product.json").then(result => result.json());
      // let data = await result;
      // applying contentful data here instead of json data file
      // maping throught every paiting to get some props
      let products = contentful.items;
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
