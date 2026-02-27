export const useVehicules = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const vehicules = useState('vehicules', () => [])
    const allVehiculesSecteur = useState('allVehiculesSecteur', () => [])
    const allVehicules = useState('allVehicules', () => [])

    const getAllVehicules = async () => {
      try {
          const { data, error } = await supabase
          .from('vehicules')
          .select('*' )
         if (error) throw error;
         allVehicules.value = data
          // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
      } catch (err) {
          console.log("erreurs :", err);
      //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
      }
    }


    const getAllSecteurDispo = async (id) => {

        try {
            const { data, error } = await supabase
            .from('vehicules')
            .select('*, carburant!inner(name)' )
            .eq('id_secteur', id)
            .eq('is_dispo', 1)
           if (error) throw error;
           vehicules.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }


    const getAllVehiculesBySecteur = async (id) => {
        try {
            const { data, error } = await supabase
            .from('vehicules')
            .select('*, carburant!inner(name)' )
            .eq('id_secteur', id)

           if (error) throw error;
           allVehiculesSecteur.value = data
         
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }


    const addVehicule = async (form) => {
        try {
        const { data : tache, error } = await supabase
        .from('vehicules')
        .insert([
            { is_dispo : form.is_dispo, acces_restreint : form.acces_restreint, id_secteur : form.secteur, capacite : form.capacite, immat : form.immat, marque : form.marque, model: form.model, autres : form.autres, id_carburant : form.id_carburant, vitesse : form.vitesse}
        ])
        .select() 
        .single() 
        if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Votre véhicule a correctement été ajouté." });
        } catch (err) {
        addToast({ type: "Error", title: "Problème lors de l'ajout d'un véhicule.",  message: err.message  });
        }
    }

    const updateVehicule = async (form) => {
        try {
    
          const { data, error } = await supabase
          .from('vehicules')
          .update({ is_dispo : form.is_dispo, acces_restreint : form.acces_restreint, capacite : form.capacite, immat : form.immat, marque : form.marque, model: form.model, autres : form.autres, id_carburant : form.id_carburant, vitesse : form.vitesse })
          .eq('id', form.id)
          .select()
          if (error) throw error;      
          addToast({ type: "Success", title: "Félicitation", message: "Votre véhicule a correctement été modifié." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la modification d'un véhicule.",  message: err.message  });
        }
      }

      const deleteVehicule = async (id) => {
        try {
          const { error } = await supabase
          .from('vehicules')
          .delete()
          .eq('id', id)
          if (error) throw error; 
          addToast({ type: "Success", title: "Félicitation", message: "Votre véhicule a correctement été supprimé." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la suppression du véhicule.",  message: err.message  });
        }
      }
    

      
  
  
  
      return { getAllSecteurDispo,getAllVehicules, getAllVehiculesBySecteur,addVehicule,updateVehicule,deleteVehicule, vehicules, allVehiculesSecteur, allVehicules}
      
  }