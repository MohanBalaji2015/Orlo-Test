# Revenue aggregator application

You are creating an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) of a revenue aggregator application. It's a React-based web application which displays a list of products of a store in a table that is sorted, filterable and displays total revenue in the filtered list.


## Setup

Follow these steps to setup the app:

1. `npm install` – install dependencies
2. `npm test` – run all tests in watch mode (should fail unless you implement the app)
3. `npm start` – serve the app at [http://localhost:3000/](http://localhost:3000/) (it automatically opens the app in your default browser)

# Task

 - Use the fetch API to request 'api/branch{1, 2, 3}.json' and render it inside a table where each row contains two columns: product name and total revenue from sales of the product
 - Branches may sell the same products, so you need to aggregate (sum) the revenue per branch
 - The table should be sorted alphabetically by product name
 - The table can be filtered by product name, the filter should be case insensitive
 - At the bottom of the table the total revenue is shown for all the products that are displayed, i.e. if you filter the table, the total needs to update
 - You should use the provided `formatNumber` function to display numbers
 - You need to get all tests passing
 - Make sure Search input is inline with the label and working
 - Don't use external libraries, the app only needs to work on the latest Chrome

# Helpful notes

 - No need to make branch loading dynamic, you can hardcode the json names
 - No need to display partial data, you can wait for all data to load
 - Make sure you are happy with the complete solution and it is done to the best of your ability