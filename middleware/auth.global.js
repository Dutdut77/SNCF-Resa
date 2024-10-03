export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useSupabaseUser();
    const client = useSupabaseClient();
    const session = useSupabaseSession();
    const userProfil = useState('userProfil', () => "") 

// if ( ! to.matched[0] ) {
//     return navigateTo({ path: '/404' })
// }

if (to.fullPath == "/") {
 return navigateTo({ path: '/calendrier/5' })
}

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
        if (to.params.id != user.secteur_admin) {
            return navigateTo({ path: '/forbidden' })
        }   
    }
    // if (to.meta.isSuperviseur) {
    //     if (user.isSuperviseur != 1) {
    //         return navigateTo({ path: '/forbidden' })
    //     }   
    // }
}

})