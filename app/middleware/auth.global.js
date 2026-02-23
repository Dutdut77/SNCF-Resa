export default defineNuxtRouteMiddleware(async (to, from) => {

    const auth = useSupabaseUser();
    const client = useSupabaseClient();
    const session = useSupabaseSession();
    const { getAll, secteurs } = useSecteurs();
    const userProfil = useState('userProfil', () => null)

    // 1. Vérifier l'authentification
    if (to.meta.requiresAuth && !session.value) {
        return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 2. Charger le profil utilisateur si session active
    if (session.value) {
        const userId = auth.value?.sub ?? auth.value?.id ?? session.value?.user?.id;
        if (userId) {
            const { data: user } = await client.from("profiles").select("*").eq("id", userId).single();
            userProfil.value = user;

            if (!user && to.meta.requiresAuth) {
                return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
            }

            if (to.meta.isAdmin) {
                if (!user || !user.secteur_admin) {
                    return navigateTo({ path: '/forbidden' })
                }
            }
        }
    }

    // 3. Redirection page d'accueil
    if (to.fullPath == "/") {
        if (session.value) {
            await getAll()
            if (userProfil.value?.favorite_secteur) {
                return navigateTo(`/calendrier/${userProfil.value.favorite_secteur}`)
            } else if (secteurs.value?.length > 0) {
                return navigateTo(`/calendrier/${secteurs.value[0].id}`)
            }
        } else {
            return navigateTo({ path: '/login' })
        }
    }

})
