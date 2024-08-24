export const useAnomalies = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const anomalies = useState('anomalies', () => [])
    const allAnomaliesSecteur = useState('allAnomaliesSecteur', () => [])
    // const allAnomaliesVehicules = useState('allAnomaliesVehicules', () => [])
    // const allAnomaliesSalles = useState('allAnomaliesSalles', () => [])
    


    const getAllAnomaliesSalle = async (id) => {
        try {
            const { data, error } = await supabase
            .from('anomalies')
            .select()
            .eq('type', 0)
            .eq('id_salle', id)
           if (error) throw error;
           anomalies.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }


    const getAllAnomaliesVehicule = async (id) => {
        try {
            const { data, error } = await supabase
            .from('anomalies')
            .select()
            .eq('type', 1)
            .eq('id_vehicule', id)
           if (error) throw error;
           anomalies.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }

    //   const getAllAnomaliesVehicules = async () => {
    //     try {

    //         const { data, error } = await supabase
    //         .from('anomalies')
    //         .select()
    //         .eq('type', 1)
            
    //         if (error) throw error;
    //        allAnomaliesVehicules.value = data
    //         // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
    //     } catch (err) {
    //         console.log("erreurs :", err);
    //     //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
    //     }
    //   }


      const getAllAnomaliesSecteur = async (id) => {
        try {

            const { data, error } = await supabase
            .from('anomalies')
            .select()
            .eq('id_secteur', id)
            
            if (error) throw error;
           allAnomaliesSecteur.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }

    //   const getAllAnomaliesSalles = async () => {
    //     try {

    //         const { data, error } = await supabase
    //         .from('anomalies')
    //         .select()
    //         .eq('type', 0)
            
    //         if (error) throw error;
    //        allAnomaliesSalles.value = data
    //         // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
    //     } catch (err) {
    //         console.log("erreurs :", err);
    //     //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
    //     }
    //   }



    const addAnomalieSalle = async ( id, anomalie, secteur) => {

        try {
            const { data, error } = await supabase
            .from('anomalies')
            .insert([
                { type : 0, id_salle : id, anomalie : anomalie, id_secteur : secteur}
            ])
            .select()
           if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Anomalie enregistrée avec succès" });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }

      const addAnomalieVehicule = async ( id, anomalie, secteur) => {

        try {
            const { data, error } = await supabase
            .from('anomalies')
            .insert([
                { type : 1, id_vehicule : id, anomalie : anomalie, id_secteur : secteur}
            ])
            .select()
           if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Anomalie enregistrée avec succès" });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }





  
      return { getAllAnomaliesSalle, getAllAnomaliesVehicule,addAnomalieSalle, getAllAnomaliesSecteur, addAnomalieVehicule, anomalies, allAnomaliesSecteur}
      
  }