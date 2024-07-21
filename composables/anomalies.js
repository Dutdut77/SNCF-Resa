export const useAnomalies = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const anomalies = useState('anomalies', () => [])



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



    const addAnomalieSalle = async ( id, anomalie) => {

        try {
            const { data, error } = await supabase
            .from('anomalies')
            .insert([
                { type : 0, id_salle : id, anomalie : anomalie}
            ])
            .select()
           if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Anomalie enregistrée avec succès" });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }

      const addAnomalieVehicule = async ( id, anomalie) => {

        try {
            const { data, error } = await supabase
            .from('anomalies')
            .insert([
                { type : 1, id_vehicule : id, anomalie : anomalie}
            ])
            .select()
           if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Anomalie enregistrée avec succès" });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }





  
      return { getAllAnomaliesSalle, getAllAnomaliesVehicule,addAnomalieSalle, addAnomalieVehicule, anomalies}
      
  }