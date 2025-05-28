import { contact } from "./tab.js";

const nouveau = document.querySelector("#nouveau");

function afficherFormulaire() {
    const formulaire = `
    <form id="form-ajout-contact" class="bg-white shadow p-4 rounded flex flex-col gap-[20px]">
        <span class="text-[13px] flex justify-center text-[30px]">Ajouter Contact</span>
        
        <input id="nom" type="text" placeholder="Nom" name="nom" required class="w-full mb-2 border rounded px-3 py-2" />
        <input id="prenom" type="text" placeholder="Prenom" name="prenom" required class="w-full mb-2 border rounded px-3 py-2" />
        <input id="num" type="tel" placeholder="+77 501 46 27" name="numero" required class="w-full mb-2 border rounded px-3 py-2" />
        
        <button type="submit" class="bg-[#40cd3f] text-white px-4 py-2 rounded flex justify-center">Enregistrer</button>
    </form>
    `;

    document.getElementById("zone-formulaire").innerHTML = formulaire;
    document.getElementById("affichergroupe").innerHTML = '';
    // document.getElementById("affichercontact").innerHTML = '';


    const inputNom = document.querySelector("#nom");
    const inputPrenom = document.querySelector("#prenom");
    const inputNum = document.querySelector("#num");
    const form = document.querySelector("#form-ajout-contact");
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const nom = inputNom.value.trim();
        const prenom = inputPrenom.value.trim();
        const num = inputNum.value.trim();
        
        if (nom === "" || prenom === "" || num === "") {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        
        contact.push({ nom:nom, prenom:prenom, numero: num });
        console.log(contact);
        
        
        inputNom.value = "";
        inputPrenom.value = "";
        inputNum.value = "";
        
        console.log("Contact ajouté :", { nom:nom, prenom:prenom,  numero: num });
    });
}

nouveau.addEventListener("click", afficherFormulaire);

let chatt= document.getElementById("zone-formulaire")
const mess=document.querySelector("#mess")
function afficherContact (){
    let nosContact=''
    chatt.innerHTML=''
contact.forEach( element=>{
     nosContact +=
    `<div id="sms" class=" flex justify-between w-[450px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50  bg-white shadow p-4 items-center gap-4 ">
             <div class="items-center justify-between flex gap-5">  
                <div class="   w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center ">
                        ${element.nom[0].toUpperCase()+element.prenom[0].toLocaleLowerCase()}
                    
                </div>

               <div> 
                    <div>
                    ${element.nom} ${element.prenom}
                    </div> 

                    <div>   
                        <div class="text-black">bonjour</div>
                    </div> 
               </div>
                
             </div>  

               <div>
                    <div>   
                      <div class="">12:00</div>
                    </div> 
                   
                 <div class=" justify-center  flex  w-[25px] h-[25px] boder-2 border-black bg-green-500 rounded-full">
                 <di class=""v>1</div>

                    </div> 
               </div>
                
    </div> `
            
        }
        )
        chatt.innerHTML= nosContact    



}
mess.addEventListener('click',afficherContact)

const gr=document.getElementById('gr')

function affichergroupe (){
    const form = `   <form id="form-ajout-contact" class="bg-white shadow p-4 rounded flex flex-col gap-[20px] ">
                  
                <button id="btn"><i  class="fa-solid fa-user-group"></i>
                </button>
                <span class="text-[13px] flex justify-center text-[30px]">Creer un Groupe</span>
                
                <input id="nom" type="text" placeholder="Nom-du-groupe" name="nom" required class="w-full mb-2 border rounded px-3 py-2" />
                
                <button type="submit" class="bg-[#40cd3f] text-white px-4 py-2 rounded flex justify-center">Enregistrer</button>
            </form>`
    document.getElementById("affichergroupe").innerHTML = form;


}

gr.addEventListener('click',()=>{
    affichergroupe()
    document.getElementById("zone-formulaire").innerHTML = '';

}
)


const btn=document.getElementById('btn')

function ajoutergroupe (){
    const groupe=`
     <div><div id="sms" class=" flex justify-between w-[450px] h-[95px] border-2 border-black rounded hover:bg-white border-gray-50  bg-white shadow p-4 items-center gap-4 ">
            <div class="items-center justify-between flex gap-5">  
               <div class="   w-[40px] h-[40px] border-gray-500 rounded-full border-2 border-black top-[10px] text-black flex flew-row justify-center items-center ">
                   
               </div>
              <div> 
                   <div>
                   </div> 

                   <div>   
                       <div class="text-black">bonjour</div>
                   </div> 
              </div>
               
            </div>  

              <div>
                   <div>   
                     <div class="">12:00</div>
                   </div>  
                <div class=" justify-center  flex  w-[25px] h-[25px] boder-2 border-black bg-green-500 rounded-full">
                <di class=""v>1</div>

                   </div> 
      </div>`
              document.getElementById("ajoutergroupe").innerHTML = groupe;
}

btn.addEventListener('click',()=>{
    ajoutergroupe()

    document.getElementById("ajoutergroupe").innerHTML='';
}
)