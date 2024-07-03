export const useSecteurs = () => {

    // const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const secteurs = useState('secteurs', () => [])
  

    const getAll = async () => {
        try {
            const { data, error } = await supabase
            .from('secteurs')
            .select()
           if (error) throw error;
           secteurs.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }
  
  
  
      return { getAll, secteurs}
      
  }