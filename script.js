function handleAgeVerifyYes(){
  $('.landing-page').on('click', '.age-verify-yes', function(e){
    getStylesList();
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
   <form id="js-form">
   <h1 class='form-title'>Find your beer</h1>
        <select id="beer-options">
        </select>
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
       <button type='button' value='${responseJson.data[i].id}' class='find-brewery'>Find Brewery</button>
       <p>ABV: ${responseJson.data[i].abv || 'N/A'}</p>
       <p>IBU: ${responseJson.data[i].ibu || 'N/A'}</p>
       <p>${responseJson.data[i].description || 'N/A'}</p>`
     )
   }
}



 
function getBeerList(styleId){
   const params = {
     key: apiKey,
     styleId: styleId,
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


function displayBreweryInfo(responseJson){
  $('#brewery-info').empty()
  for(let i = 0; i < responseJson.data.length; i++){
    $('#brewery-info').append(
      `<li><h3>${responseJson.data[i].name}</h3>
      <p>Still in business:  ${responseJson.data[i].isInBusiness}</p></li>`
    )
  }
}

function handleModalClose(){
  $('#modal').on('click','#close', function(e){
    $('#modal').css('display','none');
  })
} 

function getBrewery(){
  $('#results').on('click', '.find-brewery', function(){
    $('#brewery-info').empty();
    const beerID = $(this).val();
    const breweryURL = `https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beer/${beerID}/breweries/?key=`+apiKey;
    $('#modal').css('display', 'block')
    displayLoad();
  
    fetch(breweryURL)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    closeLoad();
    displayBreweryInfo(data)
  })
  handleModalClose()
})
}

function loadHTML(){
  return `<div class="loader"></div>`
}

function displayLoad(){
  $('#modal').append(loadHTML())
}
function closeLoad(){
  $('.loader').css('display', 'none')
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




function watchForm(){
$('form').on('submit', function(event){
  event.preventDefault();
  const styleId = $('select').find(':selected').attr('id')
  getBeerList(styleId);
  renderResultsHTML();
})
}

 
function renderSearchHTML(){
$('.landing-page').html(generateSearchHTML());

}
 
 
function generateResultsHTML(){
 return `<p id="js-error-message" class="error-message"></p>
 <h2 class='search-results'>Search results</h2>
 <section id="results" class="hidden">
 <button type='button' class='return-To-Search'>Return To Search</button>
   <div id="modal" class="modal">
  <div class="modal-content">
    <div class="container">
      <button id='close' value='x' class="button display-topright">x</button>
      <ul id='brewery-info'>
      </ul>
    </div>
  </div>
</div>
   <ul id="results-list">
   </ul>
 </section>`
}

function renderResultsHTML(){
$('.landing-page').html(generateResultsHTML());
getBrewery();
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

 
function bindEvents(){
handleAgeVerifyYes();
handleAgeVerifyNo();
}
 
$(bindEvents())