function handleAgeVerifyYes(){
  $('.landing-page').on('click', '.age-verify-yes', function(e){
    //$('.landing-page').html(renderSearchHTML())
    getStylesList();
    //watchForm();
  })
}
 
 function handleAgeVerifyNo(){
  $('.landing-page').on('click', '.age-verify-no', function(e){
    $('.landing-page').html(rendernoAccessHTML())
  })
}
 
 function noAccessHTML(){
   return `<div class='no-access'>
   <h1> Sorry!</h1>
   <p>Please come back when you are of legal age</p>`
}
 
 function rendernoAccessHTML(){
   $('.landing-page').html(noAccessHTML());
}
 
 
 function generateSearchHTML(){
  return ` <div class="container">
   <h1>Find your beer</h1>
 
     <form id="js-form">
        <select id="beer-options">
        </select>
        <input type="checkbox" id ='toggle-ABV' name='toggle-ABV'>
        <label for='toggle-ABV'>Turn on ABV</label>
        <label for="ABV">ABV</label>
        <input type="range" name="ABV" min="1" max="10" value="7" class="slider" id="ABV-slider">
       <input type="checkbox" id ='toggle-IBU' name='toggle-IBU'>
        <label for='toggle-IBU'>Turn on IBU</label>
        <label for="IBU">IBU</label>
         <input type="range" name="IBU" min="1" max="100" value="50" class="slider" id="IBU-slider">
         <input type="submit" class="submit-button" value="Cheers!">
     </form>`
}
 
 
 const apiKey='ea7ce7f27274c0049b58389ab2dfc959'
 const searchUrl='https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beers/?';
 const stylesURL = 'https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/styles/?key='+apiKey;
 
 function formatQueryParameters(params){
     const queryItems = Object.keys(params)
         .map(key => `${key}=${params[key]}`)
         return queryItems.join('&')
}
 
function displayResults(responseJson){
   $('#results-list').empty();
   for(let i = 0; i < responseJson.data.length; i++){
     $('#results-list').append(
       `<li><h3>${responseJson.data[i].name}</h3>
       <p>ABV: ${responseJson.data[i].abv}</p>
       <p>IBU: ${responseJson.data[i].ibu}</p>
       <p>${responseJson.data[i].description}</p>`
     )
   }
}

 
function getBeerList(styleId,abv, ibu, ){
   const params = {
     key: apiKey,
     styleId: styleId,
     //withDescriptions:'Y',
     //abv: "+"+abv,
     //ibu: "+"+ibu,
     //styleId: styleId,
   }
 
 const queryString = formatQueryParameters(params);
 const url = searchUrl + queryString;
 
 console.log(url)
 
 fetch(url)
   .then(response => {
     if (response.ok){
       return response.json();
     }
     throw new Error(response.statusText);
   })
   .then(function(responseJson){
     console.log(responseJson);
     displayResults(responseJson)
   })
   .catch(err => {
     $('#js-error-message').text(`Something went wrong: ${err.message}`)
   });
 
}

function getStylesList() {
fetch(stylesURL)  
  .then(res => res.json())
  .then(data =>{
   $('.landing-page').html(renderSearchHTML())
    processStylesData(data)
    watchForm()
    })
  .catch(err => console.log(err))
}

function getSliderData(form, type) {
  const range = $(form).find(`#${type}-slider`).val();
  console.log(range);
  return range;
}


function watchForm(){
$('form').on('submit', function(event){
  event.preventDefault();
  const styleId = $('select').find(':selected').attr('id')
  //const maxResults = $('#js-Max-results').val();
  const ABV = getSliderData(this, 'ABV') || 0;
  const IBU = getSliderData(this, 'IBU') || 0;
  const toggleABV= $('#toggle-ABV').is(':checked')
  const toggleIBU=$('#toggle-IBU').is(':checked')
  console.log(toggleABV, toggleIBU, ABV, IBU)
  getBeerList(styleId,ABV,IBU);
  renderResultsHTML();
})
}

 
function renderSearchHTML(){
$('.landing-page').html(generateSearchHTML());

}
 
 
function generateResultsHTML(){
 return `<p id="js-error-message" class="error-message"></p>
 <section id="results" class="hidden">
   <h2>Search results</h2>
   <ul id="results-list">
   </ul>
 </section>
 <button type='button' class='return-To-Search'>Return To Search</button>`
}

function renderResultsHTML(){
$('.landing-page').html(generateResultsHTML());
returnToSearch();
}

function returnToSearch(){
$('.landing-page').on('click', '.return-To-Search', function(e){
  getStylesList();
  $('.landing-page').html(renderSearchHTML())
})
}

function processStylesData(data) {
const styleOptionElements = data.data.map(style => {
  return `<option value="${style.shortName}" id=${style.id}>${style.shortName}</option>`;
})
console.log(styleOptionElements.join(""))
$('select').html(styleOptionElements.join(""))
}


function handleNextButton(){
 
}
 
 
function handlePreviousButton(){
 
}
 

 
function bindEvents(){
handleAgeVerifyYes();
handleAgeVerifyNo();
}
 
$(bindEvents())