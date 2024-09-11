export default defineNuxtRouteMiddleware(async (to, from) => {


const { getAll, secteurs } = useSecteurs();

await getAll();
const idExists = secteurs.value.some(obj => obj.id == to.params.id);

if (!idExists) {
    return navigateTo(`/calendrier/${secteurs.value[0].id}`)
}






})