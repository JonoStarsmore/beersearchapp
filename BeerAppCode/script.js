function handleAgeVerifyYes(){
    $('.landing-page').on('click', '.age-verify-yes', function(e){
      $('.landing-page').html(renderSearchHTML())
      watchForm();
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
         <label for="search-term">Beer Style</label>
           <input type="text" name="search-term" id="js-search-term" required>
   
         <label for="max-results">Maximum results to return</label>
           <input type="number" name="max-results" id="js-max-results" value="10">
         <label for="ABV">ABV</label>
           <input type="range" name="ABV" min="1" max="80" value="7" class="slider" id="ABV-slider">
         <label for="IBU">IBU</label>
           <input type="range" name="IBU" min="1" max="100" value="50" class="slider" id="IBU-slider">
           <input type="submit" value="Cheers!">
       </form>`
}
   
   
   const apiKey='ea7ce7f27274c0049b58389ab2dfc959'
   const searchUrl='https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/search/style?'
   
   function formatQueryParameters(params){
       const queryItems = Object.keys(params)
           .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
           return queryItems.join('&')
}
   
function displayResults(responseJson){
     $('#results-list').empty();
     for(let i = 0; i < responseJson.data.length; i++){
       $('#results-list').append(
         `<li><h3>${responseJson.data[i].name}</h3>
         <p>${responseJson.data[i].shortName}</p>
         <p>${responseJson.data[i].description}</p>`
       )
     }
}
   
function getBeerList(query,maxResults=10){
     const params = {
       q: query,
       key: apiKey,
       withDescriptions:'Y',
       maxResults
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

function getSliderData(form, type) {
    const range = $(form).find(`#${type}-slider`).val();
    console.log(range);
}


function watchForm(){
  $('form').on('submit', function(event){
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-Max-results').val();
    const ABV = getSliderData(this, 'ABV');
    const IBU = getSliderData(this, 'IBU');
    getBeerList(searchTerm, maxResults);
    renderResultsHTML();
  })
}
/*   function watchForm(){
       $('form').on('submit', function(event){
           event.preventDefault();
           const searchTerm = $('#js-search-term').val();
           const maxResults = $('#js-Max-results').val();
           getBeerList(searchTerm, maxResults);
       })
   }
*/
   
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
    $('.landing-page').html(renderSearchHTML())
})
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