let contacts = [
    {
        "name": "Andreas Pflaum",
        "e-mail": "andy@gmail.com",
        "tel": "0157733562"
    },
    {
        "name":'Lydia Lehnert',
        "e-mail":'lydia@gmail.com',
        "tel":'0157742434'

    },
    {
        "name":'Dimitrios Kapetanis',
        "e-mail":'dimi@gmail.com',
        "tel": '0157745677'
    }
 
];

let letters = contacts.map(contact => contact.name.charAt(0)); // Erster Buchstabe vom Array contacts['name'] wird übernommen!

let twolettersName = contacts.map(contact =>{                   // Zwei Buchstaben werden übergeben zb. May Musstermann = MM !
    const nameSplit = contact.name.split(' ');
    const twoNummber = nameSplit.map(teil => teil.charAt(0));
    return twoNummber.join('');
});



function newContactOpen() {
    let backround = document.getElementById('backround');
    backround.classList.remove('d-none');

}

function closeContact() {
    let backround = document.getElementById('backround');
    backround.classList.add('d-none');
}

function contactList(){
    let list = document.getElementById('newContacts');
    list.innerHTML = '';
     for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        list.innerHTML +=`
        <div>
        <div class="name-letter">${letters[i]}</div>
        <div class="contact-parting-line">
            <hr>
        </div>
        <div class="contacts">
            <button class="button-name">${twolettersName[i]}</button>
            <div class="names">
                <p>${contact['name']} <br> <a class="mail" href="">${contact['e-mail']}</a></p>
            </div>

        </div>
            
        </div>`;
        
     }
}