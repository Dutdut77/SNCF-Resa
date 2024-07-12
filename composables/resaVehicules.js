export const useResaVehicules = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");
  
    const allResaSecteurTime = useState('allResaSecteur', () => [])
  
    const allResaUserActuel= useState('allResaUserActuel', () => [])

    const getAllResaUserActuel = async () => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select()
            .eq('id_user', userProfil.value.id)
            .gte('fin', now);
           if (error) throw error;
           allResaUserActuel.value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }

    const getAllResaSecteurTime = async (secteur, dateDebut, dateFin) => {
        try {
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select()
            .eq('id_secteur', secteur)
            .gte('fin', dateDebut)
            .lte('debut', dateFin);
           if (error) throw error;
           allResaSecteurTime.value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }

    const addResaVehicule = async (form) => {
        try {
            const { data : resa, error } = await supabase
            .from('resa_vehicules')
            .insert([
              { id_vehicule : form.id_vehicule, id_secteur : form.secteur, id_user : form.id_user, debut : form.dateDebut, fin : form.dateFin, is_validated : form.is_validated },
            ])
            .select() 
            if (error) throw error;
            if (form.is_validated == 1) {
                 addToast({ type: "Success", title: "Félicitation", message: "Votre réservation a correctement été enregistrée." });
            }
            else {
                addToast({ type: "Success", title: "Félicitation", message: "Votre demande de réservation a été envoyée." });

            }
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
      }
  
     
  
  
      return { getAllResaSecteurTime,  addResaVehicule, getAllResaUserActuel, allResaSecteurTime, allResaUserActuel}
      
  }