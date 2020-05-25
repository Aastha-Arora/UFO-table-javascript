// from data.js
var tableData = data;

// Data Cleansing
// Function to replace HTML coded characters in comments
function cleanData() {
		tableData.forEach(sighting => {
		var comments = sighting.comments;
		comments = comments.replace(/&#44/g, ",");
		comments = comments.replace(/&#39/g, "'");
		comments = comments.replace(/&#33/g, "!");
		// Assigning modified comments to tableData
		sighting.comments = comments;
	});
}

// Function to generate a dropdown display for all the filters
function generateOptions() {

	filterTypes = ["datetime", "city", "state", "country", "shape"];     

	filterTypes.forEach(filter => {
		// Select corresponding HTML element
		var selectElement = d3.select(`#${filter}`);
		// Find unique values in data for each filterType
		var uniqueValues = new Set(tableData.map(sighting => sighting[filter]));
		// Appending each unique value as HTML option tag 
		uniqueValues.forEach(optionValue => {
			selectElement.append('option').text(optionValue);
		});
	})
}

// Function to display the data on the webpage
function buildTable(inputArray) {
	var tbody = d3.select("tbody");
	tbody.html("");
	inputArray.forEach(sighting => {
		var row = tbody.append("tr");
		Object.entries(sighting).forEach(([key,value]) => {
			row.append("td").text(value);
		})
	})
	d3.select("#filter-message").text(`Results Found: ${inputArray.length}`);
}

// Variable to store user selected filters
var appliedFilters = {};

// Function to select filters based on user selected values
function selectFilter() {
	// Prevent the page from refreshing
	d3.event.preventDefault();
	
	var filterId = d3.select(this).property("id");
	// console.log("seleced filter:", filterId);
	var value = d3.select(this).property("value");
	// console.log("filter value:", value);

	appliedFilters[filterId] = value;
	
	if (value === "") {
		delete appliedFilters[filterId]
	}
	
	filterTable();
}

// Function to fiter the data based on user selected filter values
function filterTable() {
	var filteredData = tableData;

	// console.log(appliedFilters);

	Object.keys(appliedFilters).forEach(filterCond => {
		filteredData = filteredData.filter(sighting => sighting[filterCond] === appliedFilters[filterCond])
	});

	buildTable(filteredData);
}

// Function to reset all filter to default option (no value selected)
function resetFilters() {
	d3.select("#datetime").property("value","");
	d3.select("#city").property("value","");
	d3.select("#state").property("value","");
	d3.select("#country").property("value","");
	d3.select("#shape").property("value","");

	appliedFilters = {};
	filterTable();
}

// Attach event to listen to changes to each filter
d3.selectAll(".filter").on("change", selectFilter);

// Attach event to reset button
d3.select("#reset-btn").on("click", resetFilters)

// Run when page loads
cleanData();
generateOptions();
buildTable(tableData);
