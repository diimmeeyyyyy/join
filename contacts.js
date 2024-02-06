let contacts = [
    {
        "name": "Andreas Pflaum",
        "e-mail": "andy@gmail.com",
        "tel": "0157733562"
    },
    {
        'name': 'Lydia Lehnert',
        'e-mail': 'lydia@gmail.com',
        'tel': '0157742434'
    },
    {
        'name': 'Dimitrios Kapetanis',
        'e-mail': 'dimi@gmail.com',
        'tel': '0157745677'
    },
    
];

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
        
     }
}