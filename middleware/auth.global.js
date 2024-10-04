export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useSupabaseUser();
    const client = useSupabaseClient();
    const session = useSupabaseSession();
    const { getAll, secteurs } = useSecteurs();
    const userProfil = useState('userProfil', () => "") 

// if ( ! to.matched[0] ) {
//     return navigateTo({ path: '/404' })
// }



if (to.meta.requiresAuth) {
        if (!session.value) {           
             return navigateTo({ path: '/login', query : { redirect : to.fullPath } })
        }  
 }

if (session.value) {
    const userProfil = useState('userProfil', () => "") 
    const { data: user } = await client.from("profiles").select("*").eq("id", session.value.user.id).single();
    userProfil.value = user



    if (to.meta.isAdmin) {
        if (user.secteur_admin == "" || user.secteur_admin == null) {
            return navigateTo({ path: '/forbidden' })
        }   
    }
    // if (to.meta.isSuperviseur) {
    //     if (user.isSuperviseur != 1) {
    //         return navigateTo({ path: '/forbidden' })
    //     }   
    // }
}

if (to.fullPath == "/") {
    if (session.value) {
        await getAll()
        if (userProfil.value.favorite_secteur != "" || userProfil.value.favorite_secteur != null) {
            const url = `/calendrier/${userProfil.value.favorite_secteur}`
             return navigateTo(url) 
       
        }
        else {
              const url = `/calendrier/${secteurs.value [0].id}`
            return navigateTo(url)        
        }
       
    }
    else {
        return navigateTo({ path: '/login' }) 
    }
 
}

})