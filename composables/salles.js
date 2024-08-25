export const useSalles = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const salles = useState('salles', () => [])
    const allSallesSecteur = useState('allSallesSecteur', () => [])


    const getAllSallesBySecteur = async (id) => {
        try {
            const { data, error } = await supabase
            .from('salles')
            .select()
            .eq('id_secteur', id)
           if (error) throw error;
           allSallesSecteur.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }



    const getAllSallesSecteurDispo = async (id) => {
        try {
            const { data, error } = await supabase
            .from('salles')
            .select()
            .eq('id_secteur', id)
            .eq('is_dispo', 1)
           if (error) throw error;
           salles.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }

      const addSalle = async (form) => {
        try {
        const { data : tache, error } = await supabase
        .from('salles')
        .insert([
            { is_dispo : form.is_dispo, name : form.name, id_secteur : form.id_secteur, wifi : form.wifi, jabra : form.jabra, clim : form.clim, white_board : form.white_board, pmr : form.pmr, adresse : form.adresse, autres : form.autres, capacite : form.capacite, video_proj : form.video_proj, webcam : form.webcam }
        ])
        .select() 
        .single() 
        if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Votre salle a correctement été ajoutée." });
        } catch (err) {
        addToast({ type: "Error", title: "Problème lors de l'ajout d'une salle.",  message: err.message  });
        }
    }

    const updateSalle = async (form) => {
        try {
    
          const { data, error } = await supabase
          .from('salles')
          .update({ is_dispo : form.is_dispo, name : form.name, id_secteur : form.id_secteur, wifi : form.wifi, jabra : form.jabra, clim : form.clim, white_board : form.white_board, pmr : form.pmr, adresse : form.adresse, autres : form.autres, capacite : form.capacite, video_proj : form.video_proj, webcam : form.webcam })
          .eq('id', form.id)
          .select()
          if (error) throw error;      
          addToast({ type: "Success", title: "Félicitation", message: "Votre salle a correctement été modifiée." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la modification d'une salle.",  message: err.message  });
        }
      }

      const deleteSalle = async (id) => {
        try {
          const { error } = await supabase
          .from('salles')
          .delete()
          .eq('id', id)
          if (error) throw error; 
          addToast({ type: "Success", title: "Félicitation", message: "Votre salle a correctement été supprimée." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la suppression du véhicule.",  message: err.message  });
        }
      }
  
  
  
      return { getAllSallesSecteurDispo, getAllSallesBySecteur, addSalle,updateSalle, deleteSalle, salles, allSallesSecteur}
      
  }