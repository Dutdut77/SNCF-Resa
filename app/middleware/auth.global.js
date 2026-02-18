export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useSupabaseUser();
    const client = useSupabaseClient();
    const session = useSupabaseSession();
    const { getAll, secteurs } = useSecteurs();
    const userProfil = useState('userProfil', () => null)

if (to.meta.requiresAuth) {
        if (!session.value) {
             return navigateTo({ path: '/login', query : { redirect : to.fullPath } })
        }
 }

if (session.value) {
    const userId = auth.value?.id ?? session.value?.user?.id;
    if (userId) {
        const { data: user } = await client.from("profiles").select("*").eq("id", userId).single();
        userProfil.value = user;

        if (to.meta.isAdmin) {
            if (!user || user.secteur_admin == "" || user.secteur_admin == null) {
                return navigateTo({ path: '/forbidden' })
            }
        }
    }
}

if (to.fullPath == "/") {
    if (session.value) {
        await getAll()
        if (userProfil.value?.favorite_secteur) {
            const url = `/calendrier/${userProfil.value.favorite_secteur}`
            return navigateTo(url)
        } else if (secteurs.value?.length > 0) {
            const url = `/calendrier/${secteurs.value[0].id}`
            return navigateTo(url)
        }
    }
    else {
        return navigateTo({ path: '/login' })
    }

}

})
