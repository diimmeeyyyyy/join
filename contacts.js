function newContact(){
    let newContact = document.getElementById('newContact');
    newContact.innerHTML =`
    <div class="backroundNewContactContainer">
        <div class="newContactContainer">
            <div class="addContact">
                <img src="" alt="Bild Join">
                <h1>Add contact</h1>
                <p> Tasks are better with a team!</p>
            </div>
            <div class="pictureAndFormContact">
                <div class="pictureNewContact">
                    <img src="" alt="Bild Contact">
                </div>
                <div>
                    <form action="formContact">
                        <input type="text" placeholder="Name"> <br>
                        <input type="email" placeholder="Email" > <br>
                        <input type="number" placeholder="Phone"> <br>
                        <button>Cancel x</button>
                        <button class="buttonContact">Create contact</button>
                    </form>
                </div>
            
            </div>

        </div>
    </div>`;
    
}