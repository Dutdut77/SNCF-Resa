export const useResaSalles = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");
  
    const allResaSallesSecteurTime = useState('allResaSallesSecteurTime', () => [])
    const allResaSallesUserActuel= useState('allResaSallesUserActuel', () => [])

    const getAllSallesResaUserActuel = async () => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_salles')
            .select('*, salles!inner(*), secteurs!inner(name)')
            .eq('id_user', userProfil.value.id)
            .gte('fin', now);
           if (error) throw error;
           allResaSallesUserActuel.value = data
           .value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }

    const getAllResaSallesSecteurTime = async (secteur, dateDebut, dateFin) => {
        try {
            const { data, error } = await supabase
            .from('resa_salles')
            .select()
            .eq('id_secteur', secteur)
            .gt('fin', dateDebut)
            .lt('debut', dateFin);
           if (error) throw error;
           allResaSallesSecteurTime.value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }

    const addResaSalles = async (form) => {
        try {
            const { data : resa, error } = await supabase
            .from('resa_salles')
            .insert([
              { id_salle : form.salle.id, id_secteur : form.secteur.id, id_user : form.id_user, debut : form.dateDebut, fin : form.dateFin, is_validated : form.is_validated },
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

    const deleteResaSalle = async (id) => {
        try {
            const { error } = await supabase
            .from('resa_salles')
            .delete()
            .eq('id', id)
            if (error) throw error;
                 addToast({ type: "Success", title: "Félicitation", message: "Votre réservation a  été annulée." });

        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }

    }
  
     
  
  
      return { getAllResaSallesSecteurTime,  addResaSalles, getAllSallesResaUserActuel,deleteResaSalle, allResaSallesSecteurTime, allResaSallesUserActuel}
      
  }