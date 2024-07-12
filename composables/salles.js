export const useSalles = () => {

    // const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const salles = useState('salles', () => [])
  

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
  
  
  
      return { getAllSallesSecteurDispo, salles}
      
  }