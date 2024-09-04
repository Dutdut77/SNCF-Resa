export const useEmail = () => {

    const { addToast } = useToast();
    const { timestampToDateFr, timestampToHeure } = useFormatDate();

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
                            <p>${profil.prenom} ${profil.nom} (${profil.email}) a effectué une demande de réservation de salle depuis l'application Résa-Pro</p>
                            <p>En tant qu'administrateur, il vous est demandé de valider / refuser cette demande en vous connectant directement à votre espace administrateur (profil -> espace admin).</p>

                    
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
                          <p>${profil.prenom} ${profil.nom} (${profil.email}) a effectué une demande de réservation d'un véhicule depuis l'application Résa-Pro</p>
                          <p>En tant qu'administrateur, il vous est demandé de valider / refuser cette demande en vous connectant directement à votre espace administrateur (profil -> espace admin).</p>
               
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

    const sendEmailValidationVehicule = async (data) => {
      const dateDebut = timestampToDateFr(data.debut)
      const heureDebut = timestampToHeure(data.debut)
      const dateFin = timestampToDateFr(data.fin)
      const heureFin = timestampToHeure(data.fin)
  
      try {
  
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

                        </style>
                  </head>
                  <body>
                    
                            <div class="header">
                            <h1>Validation de votre réservation</h1>
                            </div>
  
                            <h2>Bonjour ${data.profiles.prenom},</h2>
                            <p>Le secteur “${data.secteurs.name}” a validé votre demande de réservation d'un vehicule depuis l'application Résa-pro.</p>
                            <p>&nbsp;</p>
                            <p>Voici un récapitulatif de votre réservation :&nbsp;</p>
                            <ul>
                                <li><strong>Marque :</strong> ${data.vehicules.marque}</li>
                                <li><strong>Model :</strong> ${data.vehicules.model}</li>
                                <li><strong>Immatriculation :</strong> ${data.vehicules.immat}</li>
                                <li><strong>Début :</strong> ${dateDebut}  ${heureDebut}</li>
                                <li><strong>Fin :</strong> ${dateFin}  ${heureFin}</li>
                            </ul>
                            <p>&nbsp;</p>
                            <p>À bientôt sur Résa-pro.</p>
                            <p>&nbsp;</p>

                  </body>
                                </html>`
                
                  await $fetch("/api/sendEmail" ,{
                    method : 'post',
                    body : {
                        from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                        to : data.profiles.email,
                        subject : 'Validation réservation véhicule',
                        html : html
                    }
        
                  });
          
  
      } catch (err) {     
        addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée."});
      }
  }

  const sendEmailValidationSalle = async (data) => {
    const dateDebut = timestampToDateFr(data.debut)
    const heureDebut = timestampToHeure(data.debut)
    const dateFin = timestampToDateFr(data.fin)
    const heureFin = timestampToHeure(data.fin)

    try {

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

                      </style>
                </head>
                <body>
                  
                          <div class="header">
                          <h1>Validation de votre réservation</h1>
                          </div>

                          <h2>Bonjour ${data.profiles.prenom},</h2>
                          <p>Le secteur “${data.secteurs.name}” a validé votre demande de réservation d'une salle depuis l'application Résa-pro.</p>
                          <p>&nbsp;</p>
                          <p>Voici un récapitulatif de votre réservation :&nbsp;</p>
                          <ul>
                              <li><strong>Nom de la salle :</strong> ${data.salles.name}</li>
                              <li><strong>Adresse :</strong> ${data.salles.adresse}</li>
                              <li><strong>Début :</strong> ${dateDebut}  ${heureDebut}</li>
                              <li><strong>Fin :</strong> ${dateFin}  ${heureFin}</li>
                          </ul>
                          <p>&nbsp;</p>
                          <p>À bientôt sur Résa-pro.</p>
                          <p>&nbsp;</p>
             
                </body>
                              </html>`
              
                await $fetch("/api/sendEmail" ,{
                  method : 'post',
                  body : {
                      from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                      to : data.profiles.email,
                      subject : 'Validation réservation salle ',
                      html : html
                  }
      
                });
        

    } catch (err) {     
      addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée."});
    }
}


  
  const sendEmailRefusVehicule = async (data) => {
    const dateDebut = timestampToDateFr(data.debut)
    const heureDebut = timestampToHeure(data.debut)
    const dateFin = timestampToDateFr(data.fin)
    const heureFin = timestampToHeure(data.fin)

    try {

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
                              background:  #db1237;
                              padding: 10px;
                              text-align: center;
                              border-bottom: 1px solid #ddd;
                              color : #FFF;
                          }

                      </style>
                </head>
                <body>
                  
                          <div class="header">
                          <h1>Réservation refusée</h1>
                          </div>

                          <h2>Bonjour ${data.profiles.prenom},</h2>
                <p>Le secteur “${data.secteurs.name}” a été contraint de refuser votre réservation de vehicule.</p>
                <p>&nbsp;</p>
                <p>Voici un récapitulatif de votre réservation :&nbsp;</p>
                <ul>
                    <li><strong>Marque :</strong> ${data.vehicules.marque}</li>
                    <li><strong>Model :</strong> ${data.vehicules.model}</li>
                    <li><strong>Immatriculation :</strong> ${data.vehicules.immat}</li>
                    <li><strong>Début :</strong> ${dateDebut}  ${heureDebut}</li>
                    <li><strong>Fin :</strong> ${dateFin}  ${heureFin}</li>
                </ul>
                <p>&nbsp;</p>
                <p>Vous pouvez reformuler une autre demande directement depuis l'application Résa-Pro.</p>
                <p>À bientôt.</p>
                <p>&nbsp;</p>
              

              
             
                </body>
                              </html>`
              
                await $fetch("/api/sendEmail" ,{
                  method : 'post',
                  body : {
                      from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                      to : data.profiles.email,
                      subject : 'Refus réservation véhicule',
                      html : html
                  }
      
                });
        

    } catch (err) {     
      addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée."});
    }
}

const sendEmailRefusSalle = async (data) => {
  const dateDebut = timestampToDateFr(data.debut)
  const heureDebut = timestampToHeure(data.debut)
  const dateFin = timestampToDateFr(data.fin)
  const heureFin = timestampToHeure(data.fin)

  try {

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
                            background:  #db1237;
                            padding: 10px;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                            color : #FFF;
                        }            
                    </style>
              </head>
              <body>
                
                        <div class="header">
                           <h1>Réservation refusée</h1>
                        </div>

                        <h2>Bonjour ${data.profiles.prenom},</h2>
              <p>Le secteur “${data.secteurs.name}” a été contraint de refuser votre  réservation d'une salle depuis l'application Résa-pro.</p>
              <p>&nbsp;</p>
              <p>Voici un récapitulatif de votre réservation :&nbsp;</p>
              <ul>
                <li><strong>Nom de la salle :</strong> ${data.salles.name}</li>
                <li><strong>Adresse :</strong> ${data.salles.adresse}</li>
                <li><strong>Début :</strong> ${dateDebut}  ${heureDebut}</li>
                <li><strong>Fin :</strong> ${dateFin}  ${heureFin}</li>
              </ul>
              <p>&nbsp;</p>
              <p>Vous pouvez reformuler une autre demande directement depuis l'application Résa-Pro.</p>
              <p>À bientôt.</p>
              <p>&nbsp;</p>
            

           
              </body>
                            </html>`
            
              await $fetch("/api/sendEmail" ,{
                method : 'post',
                body : {
                    from : 'ResaPro <noreply@resa-pro.infpe.fr>',
                    to : data.profiles.email,
                    subject : 'Refus réservation salle ',
                    html : html
                }
    
              });
      

  } catch (err) {     
    addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée."});
  }
  }

      return { sendEmail,sendEmailValidationVehicule,sendEmailValidationSalle, sendEmailRefusVehicule, sendEmailRefusSalle}
      
  }