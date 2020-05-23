// Assign the data from `data.js` to a descriptive variable
var tableData = data;

// Data Cleansing
function cleanData() {

	/*
	// Code to check presence of HTML coded characters in comments
	var htmlAllCodes = [];
	tableData.forEach(sighting => {
		var comments = sighting.comments;
		var htmlCode = comments.match(/&#../g);
		if (htmlCode != null) {
			htmlAllCodes = htmlAllCodes.concat(htmlCode);
		}
	});
	// Collecting unique values of HTML codes present in comments
	htmlAllCodes = new Set(htmlAllCodes);
	console.log(htmlAllCodes);
	*/

	// Replacing HTML coded characters in comments
	tableData.forEach(sighting => {
		var comments = sighting.comments;
		comments = comments.replace(/&#44/g, ",");
		comments = comments.replace(/&#39/g, "'");
		comments = comments.replace(/&#33/g, "!");
		// Assigning modified comments to tableData
		sighting.comments = comments;
	});
}

// saving unique values for date preseset in the data
var dateSet = new Set (tableData.map(sighting => sighting.datetime));
// console.log(dateSet);

function validateUserInput(userDate) {
	return dateSet.has(userDate);
}

// Select the button
var button = d3.select("#filter-btn");

// Select the form
var form = d3.select("form");

var tbody = d3.select("tbody");
var message = d3.select("#filter-message");

//Define event handler function
function filterTable() {

	// Prevent the page from refreshing
	d3.event.preventDefault();
	
	// Select the input element and get the raw HTML node
	var userInput = d3.select("#datetime");
	// Get the value property of the input element
	var userInputValue = userInput.property("value");
	// console.log("userInputValue is:", userInputValue);

	// Initially filteredData is the entire dataset
	var filteredData = tableData;
	message.text('Showing all data. No filter applied.');

	// Check if a value was entered by user
	if (userInputValue) {
		// check if a date entered is present in the dataset
		if (validateUserInput(userInputValue)) {
			filteredData = filteredData.filter(sighting => sighting.datetime === userInputValue);
			message.text(`${filteredData.length} results found.`);
		} else {
			filteredData = [];
			message.text("No results found. Data available for dates 1/1/2010 to 1/13/2010");
		}
	} 

	buildTable(filteredData);
}

// Function to load the data on the webpage
function buildTable(inputArray) {
	tbody.html("");
	inputArray.forEach(sighting => {
		var row = tbody.append("tr");
		Object.entries(sighting).forEach(([key,value]) => {
			row.append("td").text(value);
		})
	})
}

// Create event handlers
button.on("click", filterTable);
form.on("submit", filterTable);

// Run when page loads
cleanData();
buildTable(tableData);