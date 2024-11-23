export const useResaVehicules = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");
  
    const allResaSecteurTime = useState('allResaSecteurTime', () => [])  
    const allResaUserActuel= useState('allResaUserActuel', () => [])
    const allResaSecteurVehicule = useState('allResaSecteurVehicule', () => [])  
    const allResaSecteurActuel = useState('allResaSecteurActuel', () => [])  


    const getAllResaSecteurVehicule = async (id) => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select('*, vehicules!inner(*), profiles!inner(*)')
            .eq('id_secteur', id)
 
           if (error) throw error;
           allResaSecteurVehicule.value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }


    const getAllVehiculesResaSecteurActuel = async (id) => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select('*, vehicules!inner(*), secteurs!inner(name), profiles!inner(*)')
            .eq('id_secteur', id)
            .order('debut', { ascending: false })
            .gte('fin', now);
           if (error) throw error;
           allResaSecteurActuel.value = data
        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }
    }


    const getAllVehiculesResaUserActuel = async () => {
        try {
            const now = Date.now()
            const { data, error } = await supabase
            .from('resa_vehicules')
            .select('*, vehicules!inner(*), secteurs!inner(name)')
            .eq('id_user', userProfil.value.id)
            // .eq('is_validated', 1)
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
            // .eq('is_validated', 1)
            .gt('fin', dateDebut)
            .lt('debut', dateFin);
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
              { id_vehicule : form.vehicule, id_secteur : form.secteur, id_user : form.id_user, debut : form.dateDebut, fin : form.dateFin, is_validated : form.is_validated, titre : form.titre },
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

    const deleteResaVehicule = async (id) => {
        try {
            const { error } = await supabase
            .from('resa_vehicules')
            .delete()
            .eq('id', id)
            if (error) throw error;
                 addToast({ type: "Success", title: "Félicitation", message: "Votre réservation a  été annulée." });

        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }

    }

    const updateResaVehicule = async (data) => {
        try {
            const { error } = await supabase
            .from('resa_vehicules')
            .update({ "id_vehicule" : data.vehicule, "titre": data.titre, "debut" : data.dateDebut, "fin" : data.dateFin, "is_validated" : data.is_validated})
            .eq('id', data.id)
            if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Votre réservation a correctement été modifiée." });

        } catch (err) {
            console.log("erreurs :", err);
        //   addToast({ type: "Error", title: "Problème lors de l'ajout d'une catégorie.",  message: err.message  });
        }

    }
  
    const validResaVehicule = async (id) => {
        try {
    
          const { data, error } = await supabase
          .from('resa_vehicules')
          .update({ is_validated : 1 })
          .eq('id', id)
          .select()
          if (error) throw error;      
          addToast({ type: "Success", title: "Félicitation", message: "Votre véhicule a correctement été validé." });
        } catch (err) {
          addToast({ type: "Error", title: "Problème lors de la validation.",  message: err.message  });
        }
      }
     
  
  
      return {getAllResaSecteurVehicule,  getAllResaSecteurTime,  addResaVehicule, getAllVehiculesResaSecteurActuel, getAllVehiculesResaUserActuel ,deleteResaVehicule,updateResaVehicule, validResaVehicule, allResaSecteurTime, allResaUserActuel,allResaSecteurVehicule, allResaSecteurActuel}
      
  }