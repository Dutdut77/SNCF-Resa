export const useAuth = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
 
  

    const signup = async (form) => {

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                  data: {
                    nom: form.nom,
                    prenom: form.prenom,
                  },
                },
              });
           if (error) throw error;
          addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
        } catch (err) {
          // console.log(err);
          addToast({ type: "Error", title: "Problème lors de votre enregistrement.",  message: err.message  });
        }
      }
  
    const login = async (form) => {

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
              });
           if (error) throw error;
         
        } catch (err) {
          // console.log(err);
          addToast({ type: "Error", title: "Authentification refusée !", message: "Email ou mot de passe incorrect " });
        }
      }
  
  
     const updateProfiles = async (form) => {

      try {
        const { error } = await supabase
        .from('profiles')
        .update({ nom : form.nom, prenom : form.prenom })
        .eq('id', form.id)
        .select()
        if (error) throw error;
        
        addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
      } catch (err) {
        addToast({ type: "Error", title: "Problème lors de la modification du profil.",  message: err.message  });
      }
    }









      return { signup,updateProfiles, login}
      
  }