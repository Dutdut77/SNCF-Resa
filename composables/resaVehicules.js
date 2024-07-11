export const useResaVehicules = () => {

    // const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    const allResaSecteurTime = useState('allResaSecteur', () => [])
  

    const getAllResaSecteurTime = async (secteur, dateDebut) => {
        try {
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select()
            .eq('id_secteur', secteur)
            .gte('fin', dateDebut);
           if (error) throw error;
           allResaSecteurTime.value = data
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }
  
  
  
      return { getAllResaSecteurTime, allResaSecteurTime}
      
  }