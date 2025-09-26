//pantry.js will handle all frontend code and DOM manipulation for the pantry.html page 

//BASIC FUNCTIONS (Not API related)
//function to check if the pantry is empty and display/hide a message telling users to add ingredients
const checkPantryEmpty = () => {
    //get the table body and any existing empty pantry messages from the DOM
    const tableBody = document.getElementById('pantry-table-body');
    //this should be null if there are pantry items, and an element if there are none
    const existingMessage = document.getElementById('empty-pantry-message');
    
    //create a boolean variable to check if there are any rows in the table body
    const hasItems = tableBody.querySelectorAll('tr').length > 0;
    
    //conditional logic
    if (!hasItems) {
        //if no items and no message exists, create and show the empty message
        if (!existingMessage) {
            //create a new tr element for the message
            const emptyMessage = document.createElement('tr');
            emptyMessage.id = 'empty-pantry-message';
            emptyMessage.innerHTML = `
                <td colspan="2">Pantry Empty! Add Ingredients!</td>
            `;
            //add the element to the tableBody
            tableBody.appendChild(emptyMessage);
        }
    } else {
        // If items exist and message is showing, remove the message
        if (existingMessage) {
            existingMessage.remove();
        }
    }
};

//async function to fetch the pantry items returned from the backend
const fetchPantryItems = async (event) => {
  //prevent the default form submission behavior
  event.preventDefault();
  //get the tableBody element and form from the DOM
  const tableBody = document.getElementById('pantry-table-body');
  const form = document.getElementById('pantry_form');
  //create a new FormData object to represent data as key-value pairs
  const formData = new FormData(form);
  //try, catch
  try {
    //fetch the pantry items from the server
    const response = await fetch('/pantry/add-ingredient', {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData), // converts FormData → urlencoded string
    });
    //check if the resposne is not ok and throw an error
    if (!response.ok) {
      throw new Error('Problem fetching pantry items from the server');
    }
    //parse the response as JSON 
    const pantryData = await response.json();
    //create a new table row on the dom
    const newRow = document.createElement('tr');
    //update the newRow's innerHTML with the pantry data
    newRow.innerHTML = `
      <td>${pantryData.ingredient}</td>
      <td>
        <button type="button" class="delete-button" data-id="${pantryData.id}">&times;</button>
      </td>
    `;
    //set the newRow's dataset id to the pantry item id 
    newRow.dataset.id = pantryData.id;
    //add the new pantry item to the table body 
    tableBody.appendChild(newRow);
    //add event listener to the new delete button
    const newDeleteButton = newRow.querySelector('.delete-button');
    newDeleteButton.addEventListener('click', deletePantryItem);
    //reset the form 
    form.reset();
    //call the checkPantryEmpty method to see if the pantry is empty or not 
    checkPantryEmpty();
  //catch any errors
  } catch (error) {
    //log the error to the console
    console.log('Error fetching pantry items:', error);
  }
};

//async function to delete a pantry item
const deletePantryItem = async (event) => {
    //get the id from the button's data-id attribute
    const itemId = event.target.dataset.id;
    try {
        //fetch the pantry item to delete from the server route and pass in the items id to the route to
        //be recieved on the backend
        const response = await fetch(`/pantry/delete-ingredient/${itemId}`, {
            method: 'DELETE'
        });
        //check if the response is not ok and throw an error
        if (!response.ok) {
            throw new Error(`Problem deleting pantry item from server route: /api/pantry/delete-ingredient/${itemId}`);
        }
        //parse the response as JSON
        const pantryData = await response.json();
        //get the table body element from the DOM
        const tableBody = document.getElementById('pantry-table-body');
        const rows = tableBody.querySelectorAll('tr');
        //create a boolean variable to help ensure the correct row is found and removed
        let rowFound = false;
        //loop through the rows to find the one with the matching id
        rows.forEach(row => {
            const rowId = row.dataset.id.toString();
            //if the row id matches the pantry item id, remove the row from the table body
            if (rowId === pantryData.id.toString()) {
                rowFound = true; //set the rowFound variable to true
                tableBody.removeChild(row);
            }
        });
        if (!rowFound) { //log an error message if no matching row is found
            console.log(`No matching row found for an ingredient with id: ${pantryData.id}`);
        }
        //call the checkPantryEmpty method to see if the pantry is empty or not 
        checkPantryEmpty();
    //catch any errors
    } catch (error) {
        //log the error to the console
        console.error('Error deleting pantry item:', error);
    }
};

//MAIN CODE
//ADDING EVENT LISTENERS
const form = document.getElementById('pantry_form');
//add an event listener to the submit button to call the fetchPantryItems function when the form is submitted
form.addEventListener('submit', fetchPantryItems);
//get the delete buttons from the DOM
const deleteButtons = document.querySelectorAll('.delete-button');
//loop through the delete buttons on the DOM and add an event listener to each one
deleteButtons.forEach(button => {
    button.addEventListener('click', deletePantryItem);
});
