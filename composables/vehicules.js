export const useVehicules = () => {

    // const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const vehicules = useState('vehicules', () => [])
  

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
  
  
  
      return { getAllSecteurDispo, vehicules}
      
  }