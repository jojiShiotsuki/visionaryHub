
document.querySelector('#getTotalButton').addEventListener('click', getTotal)
document.querySelector('#nextArt').addEventListener('click', nextArt)
document.querySelector('#previousArt').addEventListener('click', prevArt);

let objectID;
let object;
let num = -1;

function getTotal(){
  
  let subject = document.querySelector('#getTotalInput').value
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${subject}` // use this url to get what you want

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#totalArt').innerText = `Total ${subject} item: ${data.total}`
        
        object = data;
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
      
      showFooter();
      scrollToFooter();
  
}


function nextArt(){
  //work in this problem, problem is looping to the next object and displaying the image if it exists, through the next line. amen
  if(num <= object.objectIDs.length - 1){
    console.log(num);
    let url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${object.objectIDs[++num]}`
    
    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        let pmImageElement = document.querySelector('#pmImage');
        pmImageElement.onload = null;

        if(data.primaryImage === '')
        {
          console.log('No image')
          pmImageElement.src = ''
          pmImageElement.alt = 'No image';

        }else if(data.primaryImage === undefined){
          console.log('Value undefiend skipping...')
          nextArt();
        }else{
          document.querySelector('#nextArt').disabled = true;
          document.querySelector('#loadingMessage').innerText = 'Loading image, please wait...';
          if(data.artistAlphaSort === ''){
            document.querySelector('#author').innerText = 'No Maker'
          }else{
            document.querySelector('#author').innerText = data.artistAlphaSort
          }
          
          document.querySelector('#description').innerText = data.creditLine
          pmImageElement.src = data.primaryImage;
          pmImageElement.alt = data.title;
          
        }

        if(pmImageElement.complete){
          enableNextButton();
        }else if(data.primaryImage) {
          pmImageElement.onload = function(){
            enableNextButton();
            document.querySelector('#loadingMessage').innerText = '';
          }
        }
        document.querySelector('#artTitle').innerText = data.title;
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
  }else if(num === object.objectIDs.length){
    num = 0;
  }
  document.querySelector('#previousArt').disabled = false;
}

function prevArt() {
  console.log(num);
  if(num > 0){
    let url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${object.objectIDs[--num]}`

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        let pmImageElement = document.querySelector('#pmImage');
        pmImageElement.onload = null;

        if(data.primaryImage === '')
        {
          console.log('No image')
          pmImageElement.src = ''
          pmImageElement.alt = 'No image';

        }else if(data.primaryImage === undefined){
          console.log('skipping..')
          document.querySelector('#artTitle').innerText = 'skipping..';
        }else {
          document.querySelector('#previousArt').disabled = true;
          pmImageElement.src = data.primaryImage;
          pmImageElement.alt = data.title;
          if(data.artistAlphaSort === ''){
            document.querySelector('#author').innerText = 'No Maker'
          }else{
            document.querySelector('#author').innerText = data.artistAlphaSort
          }
        }

        document.querySelector('#artTitle').innerText = data.title;

        if(pmImageElement.complete){
          enablePrevButton();
        }else if(data.primaryImage) {
          pmImageElement.onload = function(){
            enablePrevButton();
            document.querySelector('#loadingMessage').innerText = '';
          }
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
  }else if(num === 0 || num < 0) {
    document.querySelector('#previousArt').disabled = true;
  }
}


function enableNextButton(){
  document.querySelector('#nextArt').disabled = false;
}
function enablePrevButton(){
  document.querySelector('#previousArt').disabled = false;
}
function scrollToFooter(){
  let footerSection = document.querySelector('.footerContainer');
  footerSection.scrollIntoView({ behavior: 'smooth'});
}
function showFooter(){
  let footer = document.querySelector('.footerContainer');
  footer.style.display = 'block';
}