export const useAuth = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
  
    // const categories = useState('categories', () => [])
  

    const signup = async (form) => {

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                  data: {
                    nom: form.nom,
                    prenom: form.prenom,
                    id_secteur: form.secteur,
                  },
                },
              });
           if (error) throw error;
          addToast({ type: "Success", title: "Félicitation", message: "Enregistrement réussit." });
        } catch (err) {
          console.log(err);
          addToast({ type: "Error", title: "Problème lors de votre enregistrement.",  message: err.message  });
        }
      }
  
  
  
      return { signup}
      
  }