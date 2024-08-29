export const useResaSalles = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");
  
    const allResaSallesSecteurTime = useState('allResaSallesSecteurTime', () => [])
    const allResaSallesUserActuel= useState('allResaSallesUserActuel', () => [])
    const allResaSecteurSalle= useState('allResaSecteurSalle', () => [])
    const allSallesResaSecteurActuel= useState('allSallesResaSecteurActuel', () => [])


    const getAllResaSecteurSalle= async (id) => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_salles')
            .select('*, salles!inner(*), profiles!inner(*)')
            .eq('id_secteur', id)
           if (error) throw error;
           allResaSecteurSalle.value = data
   
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }


    const getAllSallesResaUserActuel = async () => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_salles')
            .select('*, salles!inner(*), secteurs!inner(name)')
            .eq('id_user', userProfil.value.id)
            .eq('is_validated', 1)
            .gte('fin', now);
           if (error) throw error;
           allResaSallesUserActuel.value = data
       
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }

    const getAllSallesResaSecteurActuel = async (id) => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_salles')
            .select('*, salles!inner(*), secteurs!inner(name)')
            .eq('id_secteur', id)
            .gte('fin', now);
           if (error) throw error;
           allSallesResaSecteurActuel.value = data
           
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
            .eq('is_validated', 1)
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
  
    const validResaSalle = async (id) => {
        try {

          const { data, error } = await supabase
          .from('resa_salles')
          .update({ is_validated : 1 })
          .eq('id', id)
          .select()
          if (error) throw error;      
          addToast({ type: "Success", title: "Félicitation", message: "Votre salle a correctement été validée." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la validation.",  message: err.message  });
        }
      }
     
  
  
      return { getAllResaSecteurSalle, getAllResaSallesSecteurTime,  addResaSalles,getAllSallesResaSecteurActuel, getAllSallesResaUserActuel,deleteResaSalle, validResaSalle, allResaSallesSecteurTime, allResaSallesUserActuel, allResaSecteurSalle, allSallesResaSecteurActuel}
      
  }