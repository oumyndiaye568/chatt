import { contact, groupes, contactsArchives } from "./tab.js";

// Vérifier si l'utilisateur est connecté
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// Ajouter une fonction de déconnexion
window.deconnexion = function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Ajouter le bouton de déconnexion dans votre interface
// Par exemple, dans la barre latérale :
const barreGauche = document.querySelector('.bare');
barreGauche.innerHTML += `
    <button onclick="deconnexion()" 
            class="border-2 border-red-500 w-[80px] h-[70px] flex flex-col items-center justify-center rounded hover:bg-white">
        <i class="fa-solid fa-sign-out-alt text-red-500"></i>
        <span class="text-[13px]">Déconnexion</span>
    </button>
`;

const nouveau = document.querySelector("#nouveau");
const archiveButton = document.querySelector('.fa-box-archive').parentElement;
const archiveBtn = document.getElementById('archive-btn');
const diffusionBtn = document.getElementById('diffusion-btn');
let chatt = document.getElementById("zone-formulaire");
const mess=document.querySelector("#mess")
const gr=document.getElementById('gr')

// Ajouter ces variables pour gérer les messages
let messagesParContact = new Map(); // Pour stocker les messages par contact
let messagesParGroupe = new Map(); // Pour stocker les messages par groupe
let destinataireActuel = null; // Pour suivre le destinataire actuel

function afficherFormulaire() {
    const formulaire = `
    <form id="form-ajout-contact" class="bg-white shadow p-4 rounded flex flex-col gap-[20px]">
        <span class="text-[13px] flex justify-center text-[30px]">Ajouter Contact</span>
        
        <div>
            <input id="nom" type="text" placeholder="Nom" name="nom"
                class="w-full mb-2 border rounded px-3 py-2" />
            <div id="error-nom" class="text-red-500 text-sm hidden"></div>
        </div>

        <div>
            <input id="prenom" type="text" placeholder="Prenom" name="prenom"
                class="w-full mb-2 border rounded px-3 py-2" />
            <div id="error-prenom" class="text-red-500 text-sm hidden"></div>
        </div>

        <div>
            <input id="num" type="tel" placeholder="+77 501 46 27" name="numero"
                class="w-full mb-2 border rounded px-3 py-2" />
            <div id="error-num" class="text-red-500 text-sm hidden"></div>
        </div>
        
        <button type="submit" class="bg-[#40cd3f] text-white px-4 py-2 rounded flex justify-center">
            Enregistrer
        </button>
    </form>
    `;

    document.getElementById("zone-formulaire").innerHTML = formulaire;
    document.getElementById("affichergroupe").innerHTML = '';

    const form = document.querySelector("#form-ajout-contact");
    const inputNom = document.querySelector("#nom");
    const inputPrenom = document.querySelector("#prenom");
    const inputNum = document.querySelector("#num");
    
    // Ajouter la validation en temps réel
    inputNom.addEventListener('input', () => {
        if (inputNom.value.trim() === '') {
            document.getElementById('error-nom').textContent = "Renseigné d'abord se champs avant d'enregistré ";
            document.getElementById('error-nom').classList.remove('hidden');
        } else {
            document.getElementById('error-nom').classList.add('hidden');
        }
    });

    inputPrenom.addEventListener('input', () => {
        if (inputPrenom.value.trim() === '') {
            document.getElementById('error-prenom').textContent = "Renseigné d'abord se champs avant d'enregistré";
            document.getElementById('error-prenom').classList.remove('hidden');
        } else {
            document.getElementById('error-prenom').classList.add('hidden');
        }
    });

    inputNum.addEventListener('input', () => {
        const numeroRegex = /^[0-9+\s]{8,}$/;
        if (inputNum.value.trim() === '') {
            document.getElementById('error-num').textContent = "Renseigné d'abord se champs avant d'enregistré";
            document.getElementById('error-num').classList.remove('hidden');
        } else if (!numeroRegex.test(inputNum.value.trim())) {
            document.getElementById('error-num').textContent = "Le numéro doit contenir au moins 8 chiffres";
            document.getElementById('error-num').classList.remove('hidden');
        } else {
            document.getElementById('error-num').classList.add('hidden');
        }
    });
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let isValid = true;
        
        // Validation du nom
        if (inputNom.value.trim() === "") {
            document.getElementById('error-nom').textContent = "Renseigné d'abord se champs avant d'enregistré";
            document.getElementById('error-nom').classList.remove('hidden');
            isValid = false;
        }

        // Validation du prénom
        if (inputPrenom.value.trim() === "") {
            document.getElementById('error-prenom').textContent = "Renseigné d'abord se champs avant d'enregistré";
            document.getElementById('error-prenom').classList.remove('hidden');
            isValid = false;
        }

        // Validation du numéro
        const numeroRegex = /^[0-9+\s]{8,}$/;
        if (inputNum.value.trim() === "") {
            document.getElementById('error-num').textContent = "Renseigné d'abord se champs avant d'enregistré";
            document.getElementById('error-num').classList.remove('hidden');
            isValid = false;
        } else if (!numeroRegex.test(inputNum.value.trim())) {
            document.getElementById('error-num').textContent = "Le numéro doit contenir au moins 8 chiffres";
            document.getElementById('error-num').classList.remove('hidden');
            isValid = false;
        }
        
        if (isValid) {
            const nom = inputNom.value.trim();
            const prenom = inputPrenom.value.trim();
            const numero = inputNum.value.trim();
            
            // Vérifier si un contact avec le même nom existe déjà
            const contactsExistants = contact.filter(c => 
                c.nom.toLowerCase() === nom.toLowerCase() && 
                c.prenom.toLowerCase() === prenom.toLowerCase()
            );

            if (contactsExistants.length > 0) {
                // S'il existe déjà, ajouter un indice
                const nomAvecIndice = `${nom} (${contactsExistants.length + 1})`;
                contact.push({
                    nom: nomAvecIndice,
                    prenom: prenom,
                    numero: numero
                });
            } else {
                // Sinon, ajouter normalement
                contact.push({
                    nom: nom,
                    prenom: prenom,
                    numero: numero
                });
            }
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Afficher message de succès
            const successMessage = document.createElement('div');
            successMessage.className = 'text-green-500 text-center mt-2 p-2 bg-green-50 rounded';
            successMessage.textContent = 'Contact ajouté avec succès !';
            form.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            
            // Mettre à jour l'affichage des contacts
            afficherContact();
        }
    });
}

nouveau.addEventListener("click", afficherFormulaire);

function afficherContact() {
    let nosContact = ''
    chatt.innerHTML = ''
    contact.forEach(element => {
        nosContact += `
        <div id="sms" class="cursor-pointer flex justify-between w-[390px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 items-center gap-4" 
             onclick="afficherDansHeader('${element.nom}', '${element.prenom}')">
            <div class="items-center justify-between flex gap-5">  
                <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center">
                    ${element.nom[0].toUpperCase()}${element.prenom[0].toUpperCase()}
                </div>
                <div> 
                    <div class="text-black font-medium">
                        ${element.nom} ${element.prenom}
                    </div>
                    <div class="text-gray-500 text-sm">   
                        ${element.numero}
                    </div>
                </div>
            </div>
            <div>
                <div class="">12:00</div>
                <div class="justify-center flex w-[25px] h-[25px] boder-2 border-black bg-green-500 rounded-full">
                    <div>1</div>
                </div>
            </div>
        </div>`
    });
    chatt.innerHTML = nosContact;
}

// Ajout de la fonction globale pour la rendre accessible
window.afficherDansHeader = function(nom, prenom, type = 'contact') {
    const header = document.getElementById('header');
    destinataireActuel = { nom, prenom, type };
    
    const groupe = type === 'groupe' ? groupes.find(g => g.nom === nom) : null;
    
    header.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="border-2 border-black w-[42px] h-[42px] rounded-full bg-black flex items-center justify-center text-white">
                ${nom[0].toUpperCase()}${type === 'contact' && prenom ? prenom[0].toUpperCase() : ''}
            </div>
            <div>
                <div class="text-black text-lg font-medium">${nom}</div>
                ${type === 'groupe' && groupe ? `
                    <div class="text-gray-500 text-sm">${groupe.membres.length} membres</div>
                ` : ''}
            </div>
        </div>
        
        <div class="bouton flex gap-4">
            ${type === 'contact' ? `
                <button onclick="archiverContact('${nom}', '${prenom}')" 
                        class="border-2 border-gray-400 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-gray-100">
                    <i class="fa-solid fa-box-archive text-xl text-gray-400"></i>
                </button>
            ` : ''}
            <button class="border-2 border-orange-500 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-orange-100">
                <i class="fa-solid fa-delete-left text-xl text-orange-500"></i>
            </button>
            <button class="border-2 border-black w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-gray-200">
                <i class="fa-solid fa-square text-xl text-black"></i>
            </button>
            <button class="border-2 border-red-500 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-red-100">
                <i class="fa-solid fa-trash text-xl text-red-700"></i>
            </button>
        </div>`;

    // Initialiser les messages si nécessaire
    if (type === 'groupe' && !messagesParGroupe.has(nom)) {
        messagesParGroupe.set(nom, []);
    }

    afficherMessages(destinataireActuel);
};

// Modifier la fonction archiverContact
window.archiverContact = function(nom, prenom) {
    const contactIndex = contact.findIndex(c => c.nom === nom && c.prenom === prenom);
    if (contactIndex !== -1) {
        // Créer une copie du contact avant de le supprimer
        const contactToArchive = {...contact[contactIndex]};
        
        // Vérifier si le contact n'est pas déjà archivé
        const isAlreadyArchived = contactsArchives.some(
            c => c.nom === nom && c.prenom === prenom
        );
        
        if (!isAlreadyArchived) {
            // Ajouter aux archives
            contactsArchives.push(contactToArchive);
            // Retirer de la liste principale
            contact.splice(contactIndex, 1);
            
            // Mettre à jour l'affichage
            afficherContact();
            console.log("Contact archivé :", contactToArchive);
        }
    }
}

// Simplifier la fonction afficherContactsArchives
// Dans la même fonction afficherContactsArchives
function afficherContactsArchives() {
    chatt = document.getElementById("zone-formulaire");
    let archivedContacts = '';
    
    if (contactsArchives.length === 0) {
        chatt.innerHTML = '<div class="text-center p-4 bg-white shadow rounded">Aucun contact archivé</div>';
        return;
    }
    
    contactsArchives.forEach((element, index) => {
        archivedContacts += `
            <div class="cursor-pointer flex justify-between w-[390px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 items-center gap-4"
                 onclick="afficherDansHeader('${element.nom}', '${element.prenom}')">
                <div class="items-center justify-between flex gap-5">  
                    <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center">
                        ${element.nom[0].toUpperCase()}${element.prenom[0].toUpperCase()}
                    </div>
                    <div> 
                        <div class="text-black font-medium">
                            ${element.nom} ${element.prenom}
                        </div>
                        <div class="text-gray-500 text-sm">   
                            ${element.numero}
                        </div>
                    </div>
                </div>
                <div>
                    <button onclick="event.stopPropagation(); desarchiverContact(${index})" 
                            class="border-2 border-green-500 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-green-100">
                        <i class="fa-solid fa-box-open text-xl text-green-500"></i>
                    </button>
                </div>
            </div>`;
    });
    
    chatt.innerHTML = archivedContacts;
}

// Modifiez l'écouteur d'événements du bouton archive
archiveBtn.addEventListener('click', () => {
    // Vider d'abord les autres contenus
    document.getElementById("affichergroupe").innerHTML = '';
    document.getElementById("zone-formulaire").innerHTML = '';
    // Afficher les contacts archivés
    afficherContactsArchives();
});

// Ajouter cette fonction pour mettre à jour le compteur d'archives
function updateArchiveCount() {
    const count = contactsArchives.length;
    if (count > 0) {
        archiveBtn.innerHTML = `
            <i class="fa-solid fa-box-archive"></i>
            <span class="text-[13px]">Archives (${count})</span>
        `;
    }
}

mess.addEventListener('click',afficherContact)

function affichergroupe() {
    const form = `   
      <div class="w-[300px] h-[500px] border-2 border-gray-50 flex flex-col items-center bg-white shadow p-4 gap-6">
        <span>Nom Du Groupes</span>
        <input id="input" type="text" placeholder="Donne le nom" class="w-[190px] h-[20px] border-2 border-gray-400 bg-white shadow p-4">
        
        <div id="erreur-groupe" class="text-red-600 text-sm mb-2"></div>  <!-- Zone message erreur -->

        ${contact.map(c => `
            <span class="flex gap-4">${c.nom} ${c.prenom} <input class="checkbox" type="checkbox" value="${c.nom} ${c.prenom}"></span>
            <hr class="w-[200px] bg-[#f5f5dc]">
        `).join('')}

        <div>
          <button id="btn-ajouter-groupe" class="ml-[80px] border-black w-[70px] h-[40px] flex flex-col items-center justify-center rounded hover:bg-white">
            <i class="fa-solid fa-plus"></i>
            <span class="text-[13px]">Ajouter</span>
          </button>
        </div>
      </div>
    `;
    document.getElementById("affichergroupe").innerHTML = form;
}

gr.addEventListener('click', () => {
    affichergroupe();
    document.getElementById("zone-formulaire").innerHTML = '';

    // Attente de la génération du DOM puis écoute du bouton ajouter groupe
    setTimeout(() => {
        const btnAjouter = document.getElementById("btn-ajouter-groupe");
        if (btnAjouter) {
            btnAjouter.addEventListener("click", (e) => {
                e.preventDefault();
                nouveaugroupe();
            });
        }
    }, 10);
});

function nouveaugroupe() {
    const nomGroupe = document.querySelector("#input").value.trim();
    const erreurZone = document.querySelector("#erreur-groupe");
    erreurZone.textContent = "";

    if (nomGroupe === "") {
        erreurZone.textContent = "Veuillez entrer un nom de groupe.";
        return;
    }

    const checkboxes = document.querySelectorAll(".checkbox");
    const membres = [];
    checkboxes.forEach(box => {
        if (box.checked) {
            const [nom, prenom] = box.value.split(' ');
            membres.push({
                nom: box.value,
                isAdmin: false,
                numero: null // optionnel
            });
        }
    });

    if (membres.length < 2) {
        erreurZone.textContent = "Veuillez sélectionner au moins deux membres pour créer un groupe.";
        return;
    }

    // Le premier membre devient automatiquement admin
    membres[0].isAdmin = true;

    groupes.push({ nom: nomGroupe, membres: membres });
    console.log("Groupe ajouté :", { nom: nomGroupe, membres });

    // Réinitialiser formulaire
    document.querySelector("#input").value = "";
    checkboxes.forEach(c => c.checked = false);
    erreurZone.textContent = "";

    afficherGroupesDynamiques();
}

// Modifier la fonction afficherGroupesDynamiques
function afficherGroupesDynamiques() {
    const zoneGroupe = document.getElementById("affichergroupe");
    let html = "";

    groupes.forEach((groupe, groupeIndex) => {
        if (groupe.membres && groupe.membres.length >= 2) {
            html += `
                <div class="cursor-pointer w-[390px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 mb-4">
                    <div class="flex items-center gap-4 cursor-pointer" onclick="toggleGroupDetails(${groupeIndex})">
                        <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black text-black flex items-center justify-center">
                            ${groupe.nom[0].toUpperCase()}
                        </div>
                        <div>
                            <div class="text-black font-medium">${groupe.nom}</div>
                            <div class="text-gray-500 text-sm">${groupe.membres.length} membres</div>
                        </div>
                        <i class="fa-solid fa-chevron-down ml-auto transition-transform"></i>
                    </div>
                    
                    <div id="groupe-details-${groupeIndex}" class="membres-list mt-4 hidden">
                        <div class="p-2 bg-gray-50 rounded mb-2">
                            <h3 class="text-sm font-medium mb-2">Membres du groupe :</h3>
                            ${groupe.membres.map((membre, membreIndex) => `
                                <div class="flex justify-between items-center py-2 px-4 hover:bg-gray-100 rounded">
                                    <div class="flex items-center gap-2">
                                        <div class="w-[30px] h-[30px] rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                            ${membre.nom[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <span class="text-sm">${membre.nom}</span>
                                            ${membre.isAdmin ? 
                                                '<span class="text-xs text-green-600 ml-2">(Admin)</span>' : 
                                                ''}
                                        </div>
                                    </div>
                                    ${!membre.isAdmin ? `
                                        <div class="flex gap-2">
                                            <button 
                                                onclick="definirAdmin(${groupeIndex}, ${membreIndex})"
                                                class="text-blue-500 hover:text-blue-700 p-1 rounded"
                                                title="Définir comme admin">
                                                <i class="fa-solid fa-user-gear"></i>
                                            </button>
                                            <button 
                                                onclick="retirerMembre(${groupeIndex}, ${membreIndex})"
                                                class="text-red-500 hover:text-red-700 p-1 rounded"
                                                title="Retirer du groupe">
                                                <i class="fa-solid fa-user-minus"></i>
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
        }
    });

    if (zoneGroupe) {
        zoneGroupe.innerHTML = html || "<p>Aucun groupe valide à afficher.</p>";
    }
}

// Modifier la fonction toggleGroupDetails
window.toggleGroupDetails = function(groupeIndex) {
    const detailsDiv = document.getElementById(`groupe-details-${groupeIndex}`);
    const chevron = detailsDiv.parentElement.querySelector('.fa-chevron-down');
    
    if (detailsDiv) {
        const isHidden = detailsDiv.classList.contains('hidden');
        
        // Masquer tous les autres détails de groupe d'abord
        document.querySelectorAll('.membres-list').forEach(div => {
            div.classList.add('hidden');
            const otherChevron = div.parentElement.querySelector('.fa-chevron-down');
            if (otherChevron) {
                otherChevron.style.transform = 'rotate(0deg)';
            }
        });

        // Afficher/masquer le groupe sélectionné
        if (isHidden) {
            detailsDiv.classList.remove('hidden');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            detailsDiv.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
        }
    }
}

// Ajouter la fonction pour retirer un membre
window.retirerMembre = function(groupeIndex, membreIndex) {
    const groupe = groupes[groupeIndex];
    
    if (groupe && groupe.membres) {
        // Vérifier si le membre est admin
        if (groupe.membres[membreIndex].isAdmin) {
            alert("Impossible de retirer un administrateur du groupe");
            return;
        }
        
        // Vérifier qu'il restera au moins 2 membres
        if (groupe.membres.length <= 2) {
            alert("Le groupe doit avoir au moins 2 membres");
            return;
        }
        
        // Retirer le membre
        groupe.membres.splice(membreIndex, 1);
        
        // Mettre à jour l'affichage
        afficherGroupesDynamiques();
    }
}

window.definirAdmin = function(groupeIndex, membreIndex) {
    const groupe = groupes[groupeIndex];
    const erreurZone = document.querySelector("#erreur-groupe");
    
    if (groupe && groupe.membres && groupe.membres[membreIndex]) {
        // Vérifier si le membre n'est pas déjà admin
        if (groupe.membres[membreIndex].isAdmin) {
            if (erreurZone) erreurZone.textContent = "Ce membre est déjà administrateur";
            return;
        }
        
        // Définir le membre comme admin
        groupe.membres[membreIndex].isAdmin = true;
        
        // Mettre à jour l'affichage
        afficherGroupesDynamiques();
        
        if (erreurZone) erreurZone.textContent = ""; // Effacer le message d'erreur
    }
}

window.desarchiverContact = function(index) {
    // Récupérer le contact à désarchiver
    const contactADesarchiver = {...contactsArchives[index]}; // Créer une copie du contact
    
    // Vérifier si le contact n'est pas déjà dans la liste principale
    const dejaPresent = contact.some(
        c => c.nom === contactADesarchiver.nom && c.prenom === contactADesarchiver.prenom
    );
    
    if (!dejaPresent) {
        // Ajouter le contact à la liste principale
        contact.push(contactADesarchiver);
        // Retirer le contact des archives
        contactsArchives.splice(index, 1);
        
        // Mettre à jour l'affichage des contacts
        afficherContact();
        
        // Mettre à jour l'affichage des archives
        afficherContactsArchives();
        
        // Mettre à jour le compteur d'archives
        updateArchiveCount();
    }
}

// Ajouter une variable pour stocker les contacts sélectionnés pour la diffusion
let contactsSelectionnesPourDiffusion = [];

// Remplacer la déclaration existante du bouton diffusion
// const diffusionBtn = document.getElementById('diffusion-btn');

// Ajouter l'écouteur d'événements directement
if (diffusionBtn) {
    diffusionBtn.addEventListener('click', () => {
        console.log("Bouton diffusion cliqué"); // Pour déboguer
        document.getElementById("affichergroupe").innerHTML = '';
        document.getElementById("zone-formulaire").innerHTML = '';
        afficherContactsPourDiffusion();
    });
}

// Modifier la fonction afficherContactsPourDiffusion
function afficherContactsPourDiffusion() {
    const zoneFormulaire = document.getElementById("zone-formulaire");
    let html = `
        <div class="flex flex-col gap-4">
            <h3 class="font-bold mb-4 text-lg">Contacts</h3>
            <div class="contacts-list">
                ${contact.map(element => `
                    <div class="cursor-pointer flex justify-between w-[390px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 items-center gap-4 mb-2">
                        <div class="items-center justify-between flex gap-5">  
                            <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center">
                                ${element.nom[0].toUpperCase()}${element.prenom[0].toUpperCase()}
                            </div>
                            <div> 
                                <div class="text-black font-medium">
                                    ${element.nom} ${element.prenom}
                                </div>
                                <div class="text-gray-500 text-sm">   
                                    ${element.numero}
                                </div>
                            </div>
                        </div>
                        <div>
                            <input type="checkbox" 
                                class="diffusion-select w-5 h-5 accent-green-500"
                                onchange="toggleContactPourDiffusion('${element.nom}', '${element.prenom}', false, this.checked)">
                        </div>
                    </div>
                `).join('')}
            </div>

            <h3 class="font-bold mb-4 mt-6 text-lg">Groupes</h3>
            <div class="groupes-list">
                ${groupes.map((groupe, groupeIndex) => 
                    groupe.membres && groupe.membres.length >= 2 ? `
                        <div class="mb-4">
                            <div class="cursor-pointer flex justify-between w-[390px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 items-center gap-4 mb-2"
                                 onclick="afficherDansHeader('${groupe.nom}', '', 'groupe')">
                                <div class="items-center justify-between flex gap-5">  
                                    <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center">
                                        ${groupe.nom[0].toUpperCase()}
                                    </div>
                                    <div> 
                                        <div class="text-black font-medium">
                                            ${groupe.nom}
                                        </div>
                                        <div class="text-gray-500 text-sm">   
                                            ${groupe.membres.length} membres
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''
                ).join('')}
            </div>
        </div>`;

    zoneFormulaire.innerHTML = html;
}

// Ajouter la fonction pour afficher/masquer les membres d'un groupe
window.toggleGroupeMembres = function(groupeIndex, element) {
    const membresList = element.parentElement.querySelector('.membres-list');
    const chevron = element.querySelector('.fa-chevron-down');
    
    if (membresList.classList.contains('hidden')) {
        membresList.classList.remove('hidden');
        chevron.classList.add('transform', 'rotate-180');
    } else {
        membresList.classList.add('hidden');
        chevron.classList.remove('transform', 'rotate-180');
    }
}

// Ajouter la fonction pour gérer la sélection individuelle des membres
window.toggleMembrePourDiffusion = function(nom, numero, groupeIndex, membreIndex, checked) {
    if (checked) {
        if (!contactsSelectionnesPourDiffusion.some(c => c.nom === nom)) {
            contactsSelectionnesPourDiffusion.push({ nom, numero });
        }
    } else {
        contactsSelectionnesPourDiffusion = contactsSelectionnesPourDiffusion.filter(
            c => c.nom !== nom
        );
    }
}

// Ajouter une fonction de réponse automatique
function simulerReponse(destinataire) {
    const reponsesPossibles = [
        "D'accord, je vois !",
        "Merci pour ton message",
        "Je te réponds dès que possible",
        "Ok, bien reçu !",
        "Je suis occupé(e), je te réponds plus tard"
    ];

    // Choisir une réponse aléatoire
    const reponse = reponsesPossibles[Math.floor(Math.random() * reponsesPossibles.length)];
    
    // Créer le message de réponse
    const messageReponse = {
        texte: reponse,
        date: new Date(),
        type: 'reçu'
    };

    // Simuler un délai de réponse entre 1 et 3 secondes
    setTimeout(() => {
        if (destinataire.type === 'contact') {
            if (!messagesParContact.has(destinataire.nom)) {
                messagesParContact.set(destinataire.nom, []);
            }
            messagesParContact.get(destinataire.nom).push(messageReponse);
        } else if (destinataire.type === 'groupe') {
            if (!messagesParGroupe.has(destinataire.nom)) {
                messagesParGroupe.set(destinataire.nom, []);
            }
            messagesParGroupe.get(destinataire.nom).push(messageReponse);
        }
        
        // Mettre à jour l'affichage des messages
        afficherMessages(destinataire);
    }, Math.random() * 2000 + 1000); // Délai aléatoire entre 1 et 3 secondes
}

// Modifier la fonction envoyerMessage
function envoyerMessage(message) {
    const messageInput = document.querySelector('.footer input');
    if (!message) message = messageInput.value.trim();
    if (!message || !destinataireActuel) return;

    const nouveauMessage = {
        texte: message,
        date: new Date(),
        type: 'envoyé',
        auteur: 'Vous' // Pour identifier vos messages
    };

    if (destinataireActuel.type === 'groupe') {
        if (!messagesParGroupe.has(destinataireActuel.nom)) {
            messagesParGroupe.set(destinataireActuel.nom, []);
        }
        messagesParGroupe.get(destinataireActuel.nom).push(nouveauMessage);

        // Simuler des réponses des membres du groupe
        const groupe = groupes.find(g => g.nom === destinataireActuel.nom);
        if (groupe) {
            setTimeout(() => {
                const membreAleatoire = groupe.membres[
                    Math.floor(Math.random() * groupe.membres.length)
                ];
                
                const messageReponse = {
                    texte: "Je réponds au message du groupe !",
                    date: new Date(),
                    type: 'reçu',
                    auteur: membreAleatoire.nom
                };
                
                messagesParGroupe.get(destinataireActuel.nom).push(messageReponse);
                afficherMessages(destinataireActuel);
            }, Math.random() * 2000 + 1000);
        }
    }
    // Cas 2: Envoi à un contact individuel
    else if (destinataireActuel && destinataireActuel.type === 'contact') {
        if (!messagesParContact.has(destinataireActuel.nom)) {
            messagesParContact.set(destinataireActuel.nom, []);
        }
        messagesParContact.get(destinataireActuel.nom).push(nouveauMessage);
        afficherMessages(destinataireActuel);
        
        // Simuler une réponse du contact
        simulerReponse(destinataireActuel);
    }
    // Cas 3: Envoi à un groupe
    else if (destinataireActuel && destinataireActuel.type === 'groupe') {
        if (!messagesParGroupe.has(destinataireActuel.nom)) {
            messagesParGroupe.set(destinataireActuel.nom, []);
        }
        messagesParGroupe.get(destinataireActuel.nom).push(nouveauMessage);
        afficherMessages(destinataireActuel);
        
        // Simuler des réponses aléatoires des membres du groupe
        const groupe = groupes.find(g => g.nom === destinataireActuel.nom);
        if (groupe && Math.random() > 0.5) { // 50% de chance d'avoir une réponse
            simulerReponse(destinataireActuel);
        }
    }

    // Vider l'input
    messageInput.value = '';
}

// Modifier la fonction afficherDansHeader pour gérer la sélection du destinataire
window.afficherDansHeader = function(nom, prenom, type = 'contact') {
    const header = document.getElementById('header');
    destinataireActuel = { nom, prenom, type };
    
    const groupe = type === 'groupe' ? groupes.find(g => g.nom === nom) : null;
    
    header.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="border-2 border-black w-[42px] h-[42px] rounded-full bg-black flex items-center justify-center text-white">
                ${nom[0].toUpperCase()}${type === 'contact' && prenom ? prenom[0].toUpperCase() : ''}
            </div>
            <div>
                <div class="text-black text-lg font-medium">${nom}</div>
                ${type === 'groupe' && groupe ? `
                    <div class="text-gray-500 text-sm">${groupe.membres.length} membres</div>
                ` : ''}
            </div>
        </div>
        
        <div class="bouton flex gap-4">
            ${type === 'contact' ? `
                <button onclick="archiverContact('${nom}', '${prenom}')" 
                        class="border-2 border-gray-400 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-gray-100">
                    <i class="fa-solid fa-box-archive text-xl text-gray-400"></i>
                </button>
            ` : ''}
            <button class="border-2 border-orange-500 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-orange-100">
                <i class="fa-solid fa-delete-left text-xl text-orange-500"></i>
            </button>
            <button class="border-2 border-black w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-gray-200">
                <i class="fa-solid fa-square text-xl text-black"></i>
            </button>
            <button class="border-2 border-red-500 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-red-100">
                <i class="fa-solid fa-trash text-xl text-red-700"></i>
            </button>
        </div>`;

    // Initialiser les messages si nécessaire
    if (type === 'groupe' && !messagesParGroupe.has(nom)) {
        messagesParGroupe.set(nom, []);
    }

    afficherMessages(destinataireActuel);
};

// Ajouter la fonction pour afficher les messages
function afficherMessages(destinataire) {
    const chatZone = document.querySelector('.chat');
    let messages;
    
    if (destinataire.type === 'contact') {
        messages = messagesParContact.get(destinataire.nom) || [];
    } else {
        messages = messagesParGroupe.get(destinataire.nom) || [];
    }

    let html = '';
    messages.forEach(msg => {
        html += `
        <div class="message ${msg.type === 'envoyé' ? 'sent' : 'received'} m-2 p-2 rounded-lg ${
            msg.type === 'envoyé' ? 'bg-green-500 text-white ml-auto' : 'bg-white'
        } max-w-[70%] float-${msg.type === 'envoyé' ? 'right' : 'left'} clear-both">
            ${destinataire.type === 'groupe' && msg.type === 'reçu' && msg.auteur ? `
                <div class="text-xs text-gray-600 mb-1 font-medium">${msg.auteur}</div>
            ` : ''}
            <div class="message-content p-2">
                ${msg.texte}
            </div>
            <div class="message-time text-xs text-${msg.type === 'envoyé' ? 'white' : 'gray-500'} text-right">
                ${msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>`;
    });

    chatZone.innerHTML = html;
    chatZone.scrollTop = chatZone.scrollHeight;
}

// Ajouter l'écouteur d'événements pour l'envoi de messages
document.querySelector('.footer button').addEventListener('click', () => envoyerMessage());
document.querySelector('.footer input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') envoyerMessage();
});

// Ajouter une fonction de recherche
function rechercherContact(terme) {
    const searchTerm = terme.toLowerCase();
    let resultats;

    // Si le terme de recherche est "*", afficher tous les contacts triés
    if (searchTerm === "*") {
        resultats = [...contact].sort((a, b) => {
            // Trier d'abord par nom puis par prénom
            const compareNom = a.nom.toLowerCase().localeCompare(b.nom.toLowerCase());
            if (compareNom !== 0) return compareNom;
            return a.prenom.toLowerCase().localeCompare(b.prenom.toLowerCase());
        });
    } else {
        resultats = contact.filter(c => 
            c.nom.toLowerCase().includes(searchTerm) || 
            c.prenom.toLowerCase().includes(searchTerm) ||
            c.numero.includes(searchTerm)
        );
    }

    let nosContact = '';
    if (resultats.length > 0) {
        resultats.forEach(element => {
            nosContact += `
            <div class="cursor-pointer flex justify-between w-[390px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50 bg-white shadow p-4 items-center gap-4 mb-2" 
                 onclick="afficherDansHeader('${element.nom}', '${element.prenom}')">
                <div class="items-center justify-between flex gap-5">  
                    <div class="w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center">
                        ${element.nom[0].toUpperCase()}${element.prenom[0].toUpperCase()}
                    </div>
                    <div> 
                        <div class="text-black font-medium">
                            ${element.nom} ${element.prenom}
                        </div>
                        <div class="text-gray-500 text-sm">   
                            ${element.numero}
                        </div>
                    </div>
                </div>
            </div>`;
        });
    } else {
        nosContact = '<div class="text-center p-4">Aucun contact trouvé</div>';
    }
    
    document.getElementById('zone-formulaire').innerHTML = nosContact;
}

// Ajouter l'écouteur d'événements
document.getElementById('searchInput').addEventListener('input', (e) => {
    const terme = e.target.value.trim();
    if (terme !== '') {
        rechercherContact(terme);
    } else {
        afficherContact(); // Réafficher tous les contacts si la recherche est vide
    }
});

// Effacer les autres contenus lors du focus sur la recherche
document.getElementById('searchInput').addEventListener('focus', () => {
    document.getElementById('affichergroupe').innerHTML = '';
});
