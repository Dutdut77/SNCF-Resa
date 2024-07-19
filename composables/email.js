export const useEmail = () => {

    const { addToast } = useToast();


    const sendEmail = async (liste, profil, form) => {



        try {
if (form.type == 0) {
 
 const html = `<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.1;
                color: #333;
                background : #FFF
            }
            .header {
                background:  #0369a1;
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color : #FFF;
            }
                        a {
            color: #FFF; 
            text-decoration: none; 
        }
        .button-link {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #FFF;
            background-color: #0369a1;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }


        

        </style>
  </head>
  <body>
    
           <div class="header">
            <h1>Demande de réservation d'une salle</h1>
           </div>

        <h2>Bonjour,</h2>
        <p>${profil.prenom} ${profil.nom} (${profil.email}) a effectué une demande de réservation de salle depuis l'application resa-pro.infpe.fr</p>
        <p>En tant qu'administrateur, il vous est demandé de valider / refuser cette demande en vous connectant directement sur votre espace admin.</p>

<a href="#" class="button-link">Espace Administrateur</a>
  </body>
</html>`

         await $fetch("/api/sendEmail" ,{
            method : 'post',
            body : {
                from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                to : liste,
                subject : 'Demande de réservation de salle',
                html : html
            }

          });

}

if (form.type == 1) {
    const html = `<html lang="fr">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
               body {
                   font-family: Arial, sans-serif;
                   line-height: 1.1;
                   color: #333;
                   background : #FFF
               }
               .header {
                   background:  #0369a1;
                   padding: 10px;
                   text-align: center;
                   border-bottom: 1px solid #ddd;
                   color : #FFF;
               }
        a {
            color: #FFF; 
            text-decoration: none; 
        }
        .button-link {
               display: inline-block;
               padding: 10px 20px;
               font-size: 16px;
               color: #FFF;
               background-color: #0369a1;
               text-align: center;
               text-decoration: none;
               border-radius: 5px;
        }
 
           
   
           </style>
     </head>
     <body>
       
              <div class="header">
               <h1>Demande de réservation d'un véhicule</h1>
              </div>
   
           <h2>Bonjour,</h2>
           <p>${profil.prenom} ${profil.nom} (${profil.email}) a effectué une demande de réservation d'un véhicule depuis l'application resa-pro.infpe.fr</p>
           <p>En tant qu'administrateur, il vous est demandé de valider / refuser cette demande en vous connectant directement sur votre espace admin.</p>
   
   <a href="#" class="button-link">Espace Administrateur</a>
     </body>
   </html>`
   
            await $fetch("/api/sendEmail" ,{
               method : 'post',
               body : {
                   from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                   to : liste,
                   subject : 'Demande de réservation de véhicule',
                   html : html
               }
   
             });
   
   }






        } catch (err) {
     
          addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée."});
        }
    }




  
      return { sendEmail}
      
  }