var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var clc = require('cli-color');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "dphp94903",
  database: "bamazon"
});

connection.connect(function(err) {
  	if (err) throw err;
  	console.log("connected as id " + connection.threadId);
 	
 	displayInventory();
 	
});


function displayInventory(){

	var tableHead = clc.xterm(16).bold;
	var idColor =  clc.xterm(12).bold;
	var quantColor = clc.xterm(28).bold;

	connection.query("SELECT * FROM products", function(err, res) {
		if(err) throw err;

		var table = new Table({
		    head: [tableHead('Prodcut ID'), tableHead('Product Name'),tableHead('Department'),tableHead('Unit Price'),tableHead('Quantity in Stock')]
		  
		});

		for (var i = 0; i < res.length; i++) {
			
			var availQuant ="";
			
			if(res[i].stock_quantity === 0){

				availQuant = clc.xterm(9).bold.blink("Out of stock");
			}
			else{
				availQuant = res[i].stock_quantity;
			}

			table.push([idColor(res[i].item_id),
				res[i].product_name,
				res[i].department_name,
				"$"+res[i].price,
				quantColor(availQuant)]);
		}

		console.log(table.toString());
		buyItems();
	
	});
	//connection.end();
	
}

function buyItems() {
	
	inquirer.prompt([
	  {
	    name: "productID",
	    message: "Enter the Product ID that you wish to buy ?"
	  }, {
	    name: "quantity",
	    message: "How many units of the item you like to buy ?"
	  }
	]).then(function(answers) {

		var productID = answers['productID'].trim();
		var quantity = answers['quantity'].trim();

		//check value are not empty
		if(productID != "" && quantity !=""){
			console.log(isNaN(productID));
			console.log(isNaN(quantity));
			
			if(!isNaN(productID) && !isNaN(quantity)){
				//get the current stock details from the DB of the selected item
				connection.query("SELECT * FROM products WHERE ?",{ item_id:productID}, function(err, res) {
				if(err) throw err;
					
					if(res[0].stock_quantity >= quantity ){
						var Total = res[0].price*quantity;
						var name = res[0].product_name;

						var currentStock = res[0].stock_quantity - quantity;

						//update the db with current stock value;
						connection.query(
						  "UPDATE products SET ? WHERE ?",
						  [
						    {
						      stock_quantity:currentStock
						    },
						    {
						      item_id:productID
						    }
						  ],
						  function(err, res) {
						  	
						  	if(err) throw err;

						    console.log(clc.xterm(28).bold("-------------------------------- Invoice ---------------------------------------- \n"));
						    console.log(clc.xterm(16).bold("Product Name : ")+name+"\n");
						    console.log(clc.xterm(16).bold("Number of Items : ")+quantity+"\n");
						    console.log(clc.xterm(16).bold("Grand Total :")+clc.xterm(9).bold("$"+Total.toFixed(2))+"\n");
						    console.log(clc.xterm(28).bold("----------------------------------------------------------------------------------- \n"));

						    // Call deleteProduct AFTER the UPDATE completes
						     displayInventory();
						     //connection.end();
						  }
						);

					}
					else {
						console.log(clc.xterm(91).bold("------------------------------------------------------------\n"));
						console.log(clc.xterm(9).bold.blink("Insufficient quantity in stock !\n"));
						console.log(clc.xterm(16).bold("Try to lower the quantity or try different product.!\n"));
						console.log(clc.xterm(91).bold("------------------------------------------------------------\n"));

						buyItems();
					}
				});
			}
			else{
				//if the input values are invalid
				buyItems();
			}			
		}
		else{
			//if the input values are blanks
			buyItems();

		} //--- End  if(productID != "" && quantity !=""){

	});
}


