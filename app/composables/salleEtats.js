export const useSalleEtats = () => {

    const { addToast } = useToast();
    const supabase = useSupabaseClient();
    const userProfil = useState("userProfil");

    const etatsBySalle = useState('etatsBySalle', () => [])
    const etatsSallesBySecteur = useState('etatsSallesBySecteur', () => [])

    const BUCKET = 'salle-etats';

    const ETAT_TYPES = [
        { value: 1, label: 'Matériel HS' },
        { value: 2, label: 'Mobilier' },
        { value: 3, label: 'Propreté' },
        { value: 4, label: 'Clim / chauffage' },
        { value: 5, label: 'Autres' },
    ];

    const labelOfType = (type) => ETAT_TYPES.find(t => t.value == type)?.label ?? 'Inconnu';

    const SIGNED_URL_TTL = 3600;

    const signPhotos = async (etats) => {
        const photos = etats.flatMap(e => e.salle_etat_photos || []);
        if (!photos.length) return;
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(photos.map(p => p.path), SIGNED_URL_TTL);
        if (error) { console.log("erreurs :", error); return; }
        const urlByPath = new Map(data.map(d => [d.path, d.signedUrl]));
        for (const p of photos) p.url = urlByPath.get(p.path) || null;
    };

    const getEtatsSallesBySecteur = async (idSecteur) => {
        try {
            const { data, error } = await supabase
                .from('salle_etats')
                .select('*, profiles!inner(id, nom, prenom), salles!inner(id, name, adresse, id_secteur), salle_etat_photos(id, path)')
                .eq('salles.id_secteur', idSecteur)
                .order('created_at', { ascending: false })
            if (error) throw error;
            await signPhotos(data);
            etatsSallesBySecteur.value = data
        } catch (err) {
            console.log("erreurs :", err);
        }
    }

    const getEtatsBySalle = async (idSalle) => {
        try {
            const { data, error } = await supabase
                .from('salle_etats')
                .select('*, profiles!inner(id, nom, prenom), salle_etat_photos(id, path)')
                .eq('id_salle', idSalle)
                .order('created_at', { ascending: false })
            if (error) throw error;
            await signPhotos(data);
            etatsBySalle.value = data
        } catch (err) {
            console.log("erreurs :", err);
        }
    }

    const addEtat = async ({ id_salle, type, commentaire, files }) => {
        try {
            const { data: etat, error } = await supabase
                .from('salle_etats')
                .insert([{
                    id_salle,
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
                    const path = `${id_salle}/${crypto.randomUUID()}.${ext}`;
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
                        .from('salle_etat_photos')
                        .insert(paths.map(p => ({ id_etat: etat.id, path: p })));
                    if (insErr) throw insErr;
                }
            }

            addToast({ type: "Success", title: "Félicitation", message: "Le signalement a correctement été enregistré." });
            await getEtatsBySalle(id_salle);
        } catch (err) {
            console.log("erreurs :", err);
            addToast({ type: "Error", title: "Problème lors de l'enregistrement du signalement.", message: err.message });
        }
    }

    const updateEtat = async ({ id, type, commentaire }) => {
        try {
            const { error } = await supabase
                .from('salle_etats')
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
            const paths = (etat.salle_etat_photos || []).map(p => p.path);
            if (paths.length) {
                const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths);
                if (rmErr) throw rmErr;
            }

            const { error } = await supabase
                .from('salle_etats')
                .delete()
                .eq('id', etat.id);
            if (error) throw error;

            addToast({ type: "Success", title: "Félicitation", message: "Le signalement a été supprimé." });
            await getEtatsBySalle(etat.id_salle);
        } catch (err) {
            console.log("erreurs :", err);
            addToast({ type: "Error", title: "Problème lors de la suppression.", message: err.message });
        }
    }

    return {
        etatsBySalle,
        etatsSallesBySecteur,
        ETAT_TYPES,
        labelOfType,
        getEtatsBySalle,
        getEtatsSallesBySecteur,
        addEtat,
        updateEtat,
        deleteEtat,
    }
}
