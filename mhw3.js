function onMouseOver_img3()
{
img3.src='img/3.1.png';
}
function onMouseOut_img3()
{
    img3.src='img/3.png';
}

function onMouseOver_li(event)
{
    infoBox.classList.remove('hidden');
    infoBox.style.top= (event.pageY - document.getElementById('facoltà').offsetTop-50) + 'px';
    infoBox.style.left= (event.pageX - document.getElementById('facoltà').offsetLeft+10) + 'px';
    const telefono= document.createElement('text');
    const indirizzo= document.createElement('text');
    const li= event.currentTarget;
    telefono.textContent= 'telefono:' + li.dataset.telefono;
    indirizzo.textContent= 'indirizzo:' + li.dataset.indirizzo;
    infoBox.innerHTML='';
    infoBox.appendChild(telefono);
    infoBox.appendChild(indirizzo);

}
function onMouseOut_li()
{
    infoBox.classList.add('hidden');
}

function onClickInfo(){
    buttonInfo.classList.remove('b_blu');
    buttonInfo.classList.add('b_bianco');
    buttonInfo.textContent='SENZA INFO';
    for(let element of facoltà_list)
    {
        element.addEventListener('mouseover',onMouseOver_li);
        element.addEventListener('mouseout',onMouseOut_li);
    }
    buttonInfo.removeEventListener('click',onClickInfo);
    buttonInfo.addEventListener('click',onRiClickInfo);
}
function onRiClickInfo(){
    buttonInfo.classList.remove('b_bianco');
    buttonInfo.classList.add('b_blu');
    buttonInfo.textContent="PIU' INFO";
    for(let element of facoltà_list)
    {
        element.removeEventListener('mouseover',onMouseOver_li);
        element.removeEventListener('mouseover',onMouseOut_li);
    }
    buttonInfo.removeEventListener('click',onRiClickInfo);
    buttonInfo.addEventListener('click',onClickInfo);
}

function onClickCercaLibri(){
    modal_view.classList.remove('hidden');
    back.addEventListener('click',onClickBack)

}
function onClickBack(){
    modal_view.classList.add('hidden');
}
function search(event){
    event.preventDefault();
    const keyWord=encodeURIComponent(keyWordIn.value)
    fetch('http://openlibrary.org/search.json?q='+keyWord+'&lang=it')
    .then(onResponseOL)
    .then(onJsonOL);
}

function onClickBook(event){
    const book=event.currentTarget;
    fetch('https://corsproxy.io/?https://api.ebay.com/buy/browse/v1/item_summary/search?q='+book.dataset.titolo+'+'+book.dataset.autore+'&category_ids=261186&limit=1&offset=0',
        {
            headers:
            {
                'convertedFromValue': 'EUR',
                'Accept-Language': 'it-IT',
                'Authorization': 'Bearer ' + token
            }

        }).then(onResponseE).then(onJsonE);
}
function onResponseE(response)
{
    if(!response.ok){
        console.log('ERRORE RESPONSE');
        return null;
    }
    return response.json();
}
function onJsonE(json)
{
    if(json===null || json.total===0)
        {
            const nonPresente=document.createElement('text');
            nonPresente.textContent="     NON PRESENTE";
            form1.appendChild(nonPresente);
            console.log("fatto");
            setTimeout(() => { form1.removeChild(nonPresente); }, 1200);
            return;
    }
    const { itemSummaries } = json;
        const {itemWebUrl} = itemSummaries[0];
        
    //const url=json.itemSummaries.itemId;
    window.open(itemWebUrl);
}

function onResponseOL(response) {
    if(!response.ok){
        console.log('ERRORE RESPONSE');
        return null;
    }
    return response.json();
}
function onJsonOL(json){
    console.log('json ricevuto');
    libreria.innerHTML='';
    let numLibri=json.num_found;
    console.log(numLibri);
    if(numLibri>8)
        numLibri=8;
    for(let i=0; i<numLibri;i++){
        const doc=json.docs[i];
        const titolo=doc.title;
        const autore=doc.author_name;
        const book=document.createElement('div');
        book.classList.add('libro');
        book.setAttribute("data-titolo",titolo);
        book.setAttribute("data-autore",autore);
        book.addEventListener("click", onClickBook);
        if (typeof doc.isbn != "undefined") {
            const isbn = doc.isbn[0];
            const coverURL = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
            const img = document.createElement('img');
            img.src = coverURL;
            book.appendChild(img);
        }
        const caption=document.createElement('span');
        caption.textContent=titolo;
        book.appendChild(caption);
        libreria.appendChild(book);
    }
    

}

//funzione per scope
function urlEncode(str) {
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}

function spaceSeparate(str) {
    return str.replace(/(%20)+/g, ' ');
}

function urlEncodeSpaceSeparate(str) {
    return spaceSeparate(urlEncode(str));
}

const scope = 'https://api.ebay.com/oauth/api_scope';
///////////////////////////////////////////////////

const client_id='giovanni-MHW-PRD-7c42364b7-18f25a56';
const client_secret="PRD-c42364b7e9b5-4a00-4aa6-8bd0-2f1a";
let token;

fetch('https://corsproxy.io/?https://api.ebay.com/identity/v1/oauth2/token',
    {
    method: "POST",
    headers:
    {
        'Content-Type':"application/x-www-form-urlencoded",
        'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
    },
    body: 'grant_type=client_credentials&scope=' + urlEncodeSpaceSeparate(scope),
}).then(onTokenResponseE).then(onTokenJsonE);
function onTokenResponseE(response)
{
    if(!response.ok){
        console.log('ERRORE RESPONSE');
        return null;
    }
    return response.json();
}
function onTokenJsonE(json) {
    token = json.access_token;
}


const img3=document.querySelector("#img3");
img3.addEventListener('mouseover',onMouseOver_img3);
img3.addEventListener('mouseout',onMouseOut_img3);

const infoBox=document.querySelector('#infoBox');
const facoltà_list=document.querySelectorAll('#facoltà li');

const buttonInfo=document.querySelector('#più_info');
buttonInfo.addEventListener('click',onClickInfo);

const buttonLibri=document.querySelector('#cerca_libri');
buttonLibri.addEventListener('click',onClickCercaLibri);

const modal_view=document.querySelector('#modal_view');

const back=document.querySelector("#back");

const form1=document.querySelector('#form1');
form1.addEventListener('submit',search);

const keyWordIn=document.querySelector('#keyWordIn');
const libreria=document.querySelector('#libreria');