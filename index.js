const axios = require("axios");
class Product {
  static async getData() {
    try {
      const res = await axios({
        method: "get",
        url: "https://api.bigcommerce.com/stores/kqlx4d3ty2/v3/catalog/products",

        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "qkp69kfuk8fob9kuycldh2f1e6pxvrc",
          host: "api.bigcommerce.com",
        },
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log("error in getting data fro  bigcommerce", err);
    }
  }
  static async postData(data, i) {
    // console.log("insidee posttt");
    const ress = await axios({
      method: "post",
      url: "https://link_name.salesmate.io/apis/v1/products",
      data: {
        name: data.data[i].name,
        sku: data.data[i].sku,
        currency: "USD",
        unitPrice: data.data[i].sale_price,
        description: data.data[i].description,
        isActive: true,
        tags: "ro_import",
        textCustomField5: data.data[i].categories,
      },
      headers: {
        "Content-Type": "application/json",
        accessToken: "3a2bbb61-aa33-11ea-9762-39ab38becb02",
        "x-linkname": "test.salesmate.io",
      },
    });
    console.log("ress", ress);
  }
  static async start() {
    try {
      const data = await Product.getData();
      for (let i = 0; i < data.data.length; i++) {
        try {
          await Product.postData(data, i);
         }
        catch (err) {
          console.log("errror", err.response.data.Error.Message);
        }
      }
    }
     catch (err) {
      console.log("error", err);
    }
  }
}
Product.start();
