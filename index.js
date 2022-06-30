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
            } 
           else {
            console.log(err);
            }
        })
        try {
          const data = await Product.getData();
          for (let i = 0; i <data.data.length; i++) {
            try 
             {
                 const value=await Product.gett(mysqlConnection,i,data);
                //   console.log("valllllll",value.SKU);
                 if(value==data.data[i].sku&& value.Salesmateid=="Null"){
                 }
               const resid= await Product.postData(data, i);
               await Product.insertId(data,i,mysqlConnection,resid)
             }
            catch (err) {
                Product.insertError(data,i,mysqlConnection,err.response.data.Error.Message)
              console.log("errror", err.response.data.Error.Message
              );
            }
          }
        }
         catch (err) {
          console.log("error", err);
        }
      }
static async gett(mysqlConnection,i,data){
     return new Promise(function(resolve, reject) { 
         console.log("dattttttttttta",data.data[i].sku);
        mysqlConnection.query(`SELECT SKU,Salesmateid FROM Products where SKU='${data.data[i].sku}'`, function (err, result, fields) {
            if (err) throw err;
            resolve(result[i]);
            // console.log("SKUUUUUUUU",result[i].SKU);
          });
    });  
}
static async insertId(res,i,mysqlConnection,resid)
  {
    try{
        var sql =`INSERT INTO Products(Bigcommerceid,ProductName , SKU, UnitPrice, Salesmateid,isError,ErrorName)VALUES ('${res.data[i].id}','${res.data[i].name}','${res.data[i].sku}','${res.data[i].sale_price}','${resid}',false,"null")`;
        mysqlConnection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
    }
    catch(err){
        console.log("errr",err)
    }
}
static async insertError(res,i,mysqlConnection,errmes) {
         try{
            var sql = `INSERT INTO Products(Bigcommerceid,ProductName , SKU, UnitPrice, Salesmateid,isError,ErrorName)VALUES ('${res.data[i].id}','${res.data[i].name}','${res.data[i].sku}','${res.data[i].sale_price}','Null',true,'${errmes}')`;
            mysqlConnection.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
        }
        catch(err){
            console.log("errr",err)
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
      console.log(",,,,,,,,",res.data)
    } 
    catch (err) 
    {
      console.log("error in getting data from  bigcommerce", err);
    }
  }
  static async postData(data, i) {
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
    return res.data.Data.id;
}
}
Product.start();

