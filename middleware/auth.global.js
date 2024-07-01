export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useSupabaseUser();
    const client = useSupabaseClient();

if ( ! to.matched[0] ) {
    return navigateTo({ path: '/404' })
}

if (to.meta.requiresAuth) {

        if (!auth.value) {           
            return navigateTo({ path: '/login', query : { redirect : to.fullPath } })
        }  
 }

 if (auth.value) {
    const userProfil = useState('userProfil', () => "") 
    const { data: user } = await client.from("users").select("*").eq("id", auth.value.id).single();
    userProfil.value = user

    // if (to.meta.isAdmin) {
    //     if (user.isAdmin != 1) {
    //         return navigateTo({ path: '/forbidden' })
    //     }   
    // }
    // if (to.meta.isSuperviseur) {
    //     if (user.isSuperviseur != 1) {
    //         return navigateTo({ path: '/forbidden' })
    //     }   
    // }
}

})