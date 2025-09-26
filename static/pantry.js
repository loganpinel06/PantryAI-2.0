//pantry.js will handle all frontend code and DOM manipulation for the pantry.html page 

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
    //catch any errors
    } catch (error) {
        //log the error to the console
        console.error('Error deleting pantry item:', error);
    }
};

const form = document.getElementById('pantry_form');
//add an event listener to the submit button to call the fetchPantryItems function when the form is submitted
form.addEventListener('submit', fetchPantryItems);
//get the delete buttons from the DOM
const deleteButtons = document.querySelectorAll('.delete-button');
//loop through the delete buttons on the DOM and add an event listener to each one
deleteButtons.forEach(button => {
    button.addEventListener('click', deletePantryItem);
});
