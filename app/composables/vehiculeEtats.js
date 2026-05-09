export const useVehiculeEtats = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");

    const etatsByVehicule = useState('etatsByVehicule', () => [])
    const etatsBySecteur = useState('etatsBySecteur', () => [])

    const BUCKET = 'vehicule-etats';

    const ETAT_TYPES = [
        { value: 1, label: 'Sinistre' },
        { value: 2, label: 'Crevaison lente' },
        { value: 3, label: 'Impact pare-brise' },
        { value: 4, label: 'Révision' },
        { value: 5, label: 'Autres' },
    ];

    const labelOfType = (type) => ETAT_TYPES.find(t => t.value == type)?.label ?? 'Inconnu';

    const SIGNED_URL_TTL = 3600;

    const signPhotos = async (etats) => {
        const photos = etats.flatMap(e => e.vehicule_etat_photos || []);
        if (!photos.length) return;
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(photos.map(p => p.path), SIGNED_URL_TTL);
        if (error) { console.log("erreurs :", error); return; }
        const urlByPath = new Map(data.map(d => [d.path, d.signedUrl]));
        for (const p of photos) p.url = urlByPath.get(p.path) || null;
    };

    const getEtatsBySecteur = async (idSecteur) => {
        try {
            const { data, error } = await supabase
                .from('vehicule_etats')
                .select('*, profiles!inner(id, nom, prenom), vehicules!inner(id, marque, model, immat, id_secteur), vehicule_etat_photos(id, path)')
                .eq('vehicules.id_secteur', idSecteur)
                .order('created_at', { ascending: false })
            if (error) throw error;
            await signPhotos(data);
            etatsBySecteur.value = data
        } catch (err) {
            console.log("erreurs :", err);
        }
    }

    const getEtatsByVehicule = async (idVehicule) => {
        try {
            const { data, error } = await supabase
                .from('vehicule_etats')
                .select('*, profiles!inner(id, nom, prenom), vehicule_etat_photos(id, path)')
                .eq('id_vehicule', idVehicule)
                .order('created_at', { ascending: false })
            if (error) throw error;
            await signPhotos(data);
            etatsByVehicule.value = data
        } catch (err) {
            console.log("erreurs :", err);
        }
    }

    const addEtat = async ({ id_vehicule, type, commentaire, files }) => {
        try {
            const { data: etat, error } = await supabase
                .from('vehicule_etats')
                .insert([{
                    id_vehicule,
                    id_user: userProfil.value.id,
                    type,
                    commentaire: commentaire || null,
                }])
                .select()
                .single();
            if (error) throw error;

            if (files && files.length) {
                const paths = [];
                for (const file of files) {
                    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
                    const path = `${id_vehicule}/${crypto.randomUUID()}.${ext}`;
                    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type || undefined,
                    });
                    if (upErr) throw upErr;
                    paths.push(path);
                }

                if (paths.length) {
                    const { error: insErr } = await supabase
                        .from('vehicule_etat_photos')
                        .insert(paths.map(p => ({ id_etat: etat.id, path: p })));
                    if (insErr) throw insErr;
                }
            }

            addToast({ type: "Success", title: "Félicitation", message: "Le signalement a correctement été enregistré." });
            await getEtatsByVehicule(id_vehicule);
        } catch (err) {
            console.log("erreurs :", err);
            addToast({ type: "Error", title: "Problème lors de l'enregistrement du signalement.", message: err.message });
        }
    }

    const updateEtat = async ({ id, type, commentaire }) => {
        try {
            const { error } = await supabase
                .from('vehicule_etats')
                .update({ type, commentaire: commentaire || null })
                .eq('id', id);
            if (error) throw error;
            addToast({ type: "Success", title: "Félicitation", message: "Le signalement a été modifié." });
        } catch (err) {
            console.log("erreurs :", err);
            addToast({ type: "Error", title: "Problème lors de la modification.", message: err.message });
        }
    }

    const deleteEtat = async (etat) => {
        try {
            const paths = (etat.vehicule_etat_photos || []).map(p => p.path);
            if (paths.length) {
                const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);
                if (rmErr) throw rmErr;
            }

            const { error } = await supabase
                .from('vehicule_etats')
                .delete()
                .eq('id', etat.id);
            if (error) throw error;

            addToast({ type: "Success", title: "Félicitation", message: "Le signalement a été supprimé." });
            await getEtatsByVehicule(etat.id_vehicule);
        } catch (err) {
            console.log("erreurs :", err);
            addToast({ type: "Error", title: "Problème lors de la suppression.", message: err.message });
        }
    }

    return {
        etatsByVehicule,
        etatsBySecteur,
        ETAT_TYPES,
        labelOfType,
        getEtatsByVehicule,
        getEtatsBySecteur,
        addEtat,
        updateEtat,
        deleteEtat,
    }
}
