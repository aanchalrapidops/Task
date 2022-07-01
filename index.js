const axios = require("axios");
const mysql = require("mysql");
class Product {
  static async start() {
    var mysqlConnection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "db1",
    });
    mysqlConnection.connect((err) => {
      if (!err) {
        console.log("connected to MYSQL");
      } else {
        console.log(err);
      }
    });
    const data = await Product.getData();
    for (let i = 0; i < data.data.length; i++) {
      const value = await Product.gett(mysqlConnection, i, data);
      if (
        value.length &&
        value[0].SKU === data.data[i].sku &&
        value[0].Salesmateid === "Null"
      ) {
        console.log("postdata");
        try {
          const resid = await Product.postData(data, i);
          await Product.updateId(mysqlConnection, data, resid, i);
        } catch (err) {
          await Product.updateError(
            data,
            i,
            mysqlConnection,
            err.response.data.Error.Message
          );
        }
      } else {
        console.log("add without sku");
        try {
          const resid = await Product.postData(data, i);
          console.log(resid);
          await Product.insertId(data, i, mysqlConnection, resid.data.id);
        } catch (err) {
          Product.insertError(
            data,
            i,
            mysqlConnection,
            err.response.data.Error.Message
          );
        }
      }
    }
  }

  static updateError(data, i, mysqlConnection, errName) {
    try {
      var sql = `update  Products SET Salesmateid="Null",isError=true,ErrorName="${errName}" WHERE SKU="${data.data[i].sku}"`;
      mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
      });
    } catch (err) {
      if (err) throw err;
    }
  }

  static async updateId(mysqlConnection, data, resid, i) {
    try {
      var sql = `update  Products SET Salesmateid="${resid.data.id}",isError=false,ErrorName="Null" WHERE SKU="${data.data[i].sku}"`;
      mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
      });
    } catch (err) {
      if (err) throw err;
    }
  }

  static async gett(mysqlConnection, i, data) {
    return new Promise(function (resolve, reject) {
      mysqlConnection.query(
        `SELECT SKU,Salesmateid FROM Products where SKU='${data.data[i].sku}'`,
        function (err, result, fields) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  }
  static async insertId(res, i, mysqlConnection, resid) {
    try {
      var sql = `INSERT INTO Products(Bigcommerceid,ProductName,SKU, UnitPrice, Salesmateid,isError,ErrorName)VALUES ('${res.data[i].id}','${res.data[i].name}','${res.data[i].sku}','${res.data[i].sale_price}','${resid}',false,"null")`;
      mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    } catch (err) {
      if (err) throw err;
    }
  }
  static async insertError(res, i, mysqlConnection, errmes) {
    try {
      var sql = `INSERT INTO Products(Bigcommerceid,ProductName , SKU, UnitPrice, Salesmateid,isError,ErrorName)VALUES ('${res.data[i].id}','${res.data[i].name}','${res.data[i].sku}','${res.data[i].sale_price}','Null',true,'${errmes}')`;
      mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    } catch (err) {
      if (err) throw err;
    }
  }
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
      return res.data;
    } catch (err) {
      console.log("error in getting data from  bigcommerce", err);
    }
  }
  static async postData(data, i) {
    const res = await axios({
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
    console.log(res);
    return res.data;
  }
}
Product.start();
