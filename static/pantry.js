//pantry.js will handle all frontend code and DOM manipulation for the pantry.html page 

//create an async function to fetch the pantry items returned from the backend
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
