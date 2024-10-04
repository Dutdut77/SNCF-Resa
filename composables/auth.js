export const useAuth = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const allProfiles= useState('allProfiles', () => [])

  

    const signup = async (form) => {

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                  data: {
                    nom: form.nom,
                    prenom: form.prenom,
                  },
                },
              });
           if (error) throw error;
          addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
        } catch (err) {
          // console.log(err);
          addToast({ type: "Error", title: "Problème lors de votre enregistrement.",  message: err.message  });
        }
      }
  
    const login = async (form) => {

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
              });
           if (error) throw error;
         
        } catch (err) {
          // console.log(err);
          addToast({ type: "Error", title: "Authentification refusée !", message: "Email ou mot de passe incorrect " });
        }
      }
  
  
     const updateProfiles = async (form) => {

      try {
        const { error } = await supabase
        .from('profiles')
        .update({ nom : form.nom, prenom : form.prenom, favorite_secteur : form.favorite_secteur })
        .eq('id', form.id)
        .select()
        if (error) throw error;
        
        addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
      } catch (err) {
        addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
      }
    }



    const getAllProfiles = async (form) => {

      try {
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        if (error) throw error;
        allProfiles.value = data

      } catch (err) {
        addToast({ type: "Error", title: "Problème lors du chargement des profiles.",  message: err.message  });
      }
    }


    const addValideur = async (form) => {

      // Convertir la chaîne en tableau d'entiers
      let secteurArray = form.secteur_auth.split(',').map(Number);
      // Vérifier si le chiffre 5 est déjà présent
      if (!secteurArray.includes(Number(form.secteur))) {
        secteurArray.push(Number(form.secteur));  // Ajouter 5 au tableau s'il n'est pas présent
      }
      // Reconvertir le tableau en chaîne de caractères
      form.secteur_auth = secteurArray.join(',');

      try {
        const { error } = await supabase
        .from('profiles')
        .update({ secteur_auth : form.secteur_auth })
        .eq('id', form.id)
        .select()
        if (error) throw error;
        
        addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
      } catch (err) {
        addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
      }
    }

    const deleteValideur = async (form) => {

      // Convertir la chaîne en tableau d'entiers
      let secteurArray = form.secteur_auth.split(',').map(Number);

      // Filtrer le tableau pour supprimer le chiffre 5
      secteurArray = secteurArray.filter(num => num !== Number(form.secteur));

      // Reconvertir le tableau en chaîne de caractères
      form.secteur_auth = secteurArray.join(',');

      try {
        const { error } = await supabase
        .from('profiles')
        .update({ secteur_auth : form.secteur_auth })
        .eq('id', form.id)
        .select()
        if (error) throw error;
        
        addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
      } catch (err) {
        addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
      }
    }

    const addAdmin = async (form) => {
            try {
              const { error } = await supabase
              .from('profiles')
              .update({ secteur_admin : Number(form.secteur) })
              .eq('id', form.id)
              .select()
              if (error) throw error;
              
              addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
            } catch (err) {
              addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
            }
          }

    const deleteAdmin = async (form) => {

      try {
        const { error } = await supabase
        .from('profiles')
        .update({ secteur_admin : null })
        .eq('id', form.id)
        .select()
        if (error) throw error;
        
        addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
      } catch (err) {
        addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
      }
    }



      return { signup,updateProfiles, getAllProfiles, addValideur,addAdmin, deleteAdmin, login,deleteValideur, allProfiles}
      
  }