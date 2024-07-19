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
  
      const getMailSuperviseursSecteur = async (liste) => {
        try {
            const { data, error } = await supabase
            .from('profiles')
            .select('id, email, nom, prenom')

            let idsListe = liste.split(',').map(id => id.trim());

            let emails = data
            .filter(obj => idsListe.includes(obj.id))
            .map(obj => obj.email);
            
     

        if (error) throw error;
           return emails
            // addToast({ type: "Success", title: "Félicitation", message: "Votre catégorie a correctement été ajoutée." });
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }
  
  
      return { getAll,getMailSuperviseursSecteur, secteurs}
      
  }