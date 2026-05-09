export const useEmail = () => {

    const { addToast } = useToast();
    const { timestampToDateFr, timestampToHeure } = useFormatDate();

    const palettes = {
        info: { bg: '#0369a1', soft: '#eff6ff', border: '#bae6fd', text: '#0c4a6e' },
        success: { bg: '#15803d', soft: '#f0fdf4', border: '#bbf7d0', text: '#14532d' },
        danger: { bg: '#b91c1c', soft: '#fef2f2', border: '#fecaca', text: '#7f1d1d' },
        warning: { bg: '#b45309', soft: '#fffbeb', border: '#fde68a', text: '#78350f' },
    };

    const buildTemplate = ({ palette = 'info', eyebrow, title, subtitle = '', body }) => {
        const p = palettes[palette];
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <title>${title}</title>
    <style>
        body { margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #eef2f7; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        body, td, p, span, div { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #0f172a; }
        .body-cell p { margin: 0 0 14px; font-size: 15px; line-height: 1.55; color: #334155; }
        .body-cell p.greeting { font-size: 17px; color: #0f172a; font-weight: 600; margin-bottom: 12px; }
        .body-cell strong { font-weight: 600; color: #0f172a; }
        .card { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; margin: 22px 0 8px; background-color: #ffffff; }
        .card-head td { padding: 12px 20px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; }
        .card-row td { padding: 12px 20px; font-size: 14px; vertical-align: top; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; }
        .card-row:last-child td { border-bottom: 0; }
        .card-label { color: #64748b; font-weight: 500; width: 40%; white-space: nowrap; }
        .card-value { color: #0f172a; font-weight: 600; }
        .alert { width: 100%; margin: 22px 0 8px; border-radius: 12px; background-color: #fffbeb; border-left: 4px solid #d97706; }
        .alert td { padding: 16px 20px; }
        .alert.danger { background-color: #fef2f2; border-left-color: #dc2626; }
        .alert-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 6px; color: #78350f; }
        .alert.danger .alert-title { color: #7f1d1d; }
        .alert p { margin: 4px 0; font-size: 14px; color: #78350f; }
        .alert.danger p { color: #7f1d1d; }
        .note { width: 100%; margin: 20px 0 8px; background-color: #f1f5f9; border-radius: 10px; }
        .note td { padding: 14px 18px; font-size: 14px; color: #475569; }
        .closing { margin-top: 22px; font-size: 14px; color: #475569; }
        .chip { display: inline-block; background-color: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.30); padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 14px; color: #ffffff; mso-padding-alt: 5px 12px; }
        h1.email-title { margin: 0; font-size: 26px; line-height: 1.25; font-weight: 700; letter-spacing: -0.3px; color: #ffffff; }
        .header-sub { margin: 8px 0 0; font-size: 14px; color: #ffffff; opacity: 0.92; }
        @media only screen and (max-width: 480px) {
            .px-mobile { padding-left: 22px !important; padding-right: 22px !important; }
            h1.email-title { font-size: 22px !important; }
            .card-label { width: 44% !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#eef2f7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef2f7" style="background-color:#eef2f7;">
        <tr>
            <td align="center" style="padding: 24px 12px;">
                <!--[if mso]>
                <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>
                <![endif]-->
                <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%; max-width:620px; background-color:#ffffff; border-radius:16px;">
                    <tr>
                        <td height="4" bgcolor="${p.bg}" style="height:4px; line-height:4px; font-size:0; background-color:${p.bg};">&nbsp;</td>
                    </tr>
                    <tr>
                        <td bgcolor="${p.bg}" class="px-mobile" style="background-color:${p.bg}; padding: 36px 40px 30px; color:#ffffff;">
                            <span class="chip">${eyebrow}</span>
                            <h1 class="email-title">${title}</h1>
                            ${subtitle ? `<p class="header-sub">${subtitle}</p>` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" class="body-cell px-mobile" style="background-color:#ffffff; padding: 32px 40px 24px;">
                            ${body}
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f8fafc" class="px-mobile" style="background-color:#f8fafc; padding: 22px 40px 26px; border-top:1px solid #e2e8f0; text-align:center;">
                            <div style="font-weight:700; color:#0369a1; font-size:14px; letter-spacing:0.3px;">Résa-Pro</div>
                            <p style="margin:4px 0 0; font-size:12px; color:#94a3b8;">Application de réservation — SNCF Infrapôle Paris-Est</p>
                            <p style="margin:4px 0 0; font-size:12px; color:#94a3b8;">Email automatique, merci de ne pas y répondre.</p>
                        </td>
                    </tr>
                </table>
                <!--[if mso]>
                </td></tr></table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>`;
    };

    const buildCard = (title, items) => `
        <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; margin: 22px 0 8px;">
            <tr class="card-head">
                <td colspan="2" bgcolor="#f8fafc" style="background-color:#f8fafc; padding:12px 20px; border-bottom:1px solid #e2e8f0; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#64748b;">${title}</td>
            </tr>
            ${items.map(({ label, value }) => `
            <tr class="card-row">
                <td class="card-label" bgcolor="#ffffff" style="background-color:#ffffff; padding:12px 20px; font-size:14px; vertical-align:top; border-bottom:1px solid #f1f5f9; color:#64748b; font-weight:500; width:40%; white-space:nowrap;">${label}</td>
                <td class="card-value" bgcolor="#ffffff" style="background-color:#ffffff; padding:12px 20px; font-size:14px; vertical-align:top; border-bottom:1px solid #f1f5f9; color:#0f172a; font-weight:600;">${value}</td>
            </tr>`).join('')}
        </table>`;

    const buildAlert = ({ variant = 'warning', title, lines = [] }) => {
        const isDanger = variant === 'danger';
        const bg = isDanger ? '#fef2f2' : '#fffbeb';
        const border = isDanger ? '#dc2626' : '#d97706';
        const textColor = isDanger ? '#7f1d1d' : '#78350f';
        return `
        <table role="presentation" class="alert${isDanger ? ' danger' : ''}" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:100%; margin: 22px 0 8px; border-radius:12px; background-color:${bg}; border-left:4px solid ${border};">
            <tr>
                <td style="padding:16px 20px;">
                    <p class="alert-title" style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; margin:0 0 6px; color:${textColor};">⚠️ ${title}</p>
                    ${lines.map((l) => `<p style="margin:4px 0; font-size:14px; color:${textColor}; line-height:1.5;">${l}</p>`).join('')}
                </td>
            </tr>
        </table>`;
    };

    const buildNote = (text) => `
        <table role="presentation" class="note" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f5f9" style="width:100%; margin:20px 0 8px; background-color:#f1f5f9; border-radius:10px;">
            <tr><td style="padding:14px 18px; font-size:14px; color:#475569; line-height:1.55;">${text}</td></tr>
        </table>`;

    const anomalieAlert = buildAlert({
        variant: 'warning',
        title: 'Vérification du véhicule obligatoire',
        lines: [
            'Avant utilisation, le conducteur doit <strong>vérifier l\'état général du véhicule</strong> (carrosserie, pneus, niveaux, propreté intérieure).',
            'Toute anomalie constatée doit être <strong>signalée immédiatement via l\'application Résa-Pro</strong> ou en <strong>scannant le QR code</strong> apposé dans le véhicule.',
            '<strong>En l\'absence de remontée, le dernier conducteur sera tenu responsable</strong> des anomalies découvertes par la suite.',
        ],
    });

    const formatDates = (data) => ({
        dateDebut: timestampToDateFr(data.debut),
        heureDebut: timestampToHeure(data.debut),
        dateFin: timestampToDateFr(data.fin),
        heureFin: timestampToHeure(data.fin),
    });

    const doSend = async (to, subject, html) => {
        await $fetch("/api/sendEmail", {
            method: 'post',
            body: {
                from: 'ResaPro <noreply@resa-pro.infpe.fr>',
                to,
                subject,
                html,
            }
        });
    };

    const sendEmail = async (liste, profil, form) => {
        try {
            const body = `
                <p class="greeting">Bonjour,</p>
                <p><strong>${profil.prenom} ${profil.nom}</strong> a effectué une nouvelle demande de réservation depuis l'application Résa-Pro.</p>
                ${buildCard('Informations du demandeur', [
                    { label: 'Nom', value: profil.nom },
                    { label: 'Prénom', value: profil.prenom },
                    { label: 'Email', value: profil.email },
                ])}
                ${buildNote('En tant que valideur, merci de traiter cette demande (validation ou refus) depuis votre espace administrateur.')}
            `;

            const html = buildTemplate({
                palette: 'info',
                eyebrow: 'Nouvelle demande',
                title: 'Une réservation attend votre validation',
                subtitle: `${profil.prenom} ${profil.nom} a soumis une demande`,
                body,
            });

            await doSend(liste, `Résa-Pro : Nouvelle demande de ${profil.prenom} ${profil.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailValidationVehicule = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Bonne nouvelle ! Le secteur <strong>${data.secteurs.name}</strong> a validé votre demande de réservation de véhicule.</p>
                ${buildCard('Récapitulatif de la réservation', [
                    { label: 'Marque', value: data.vehicules.marque },
                    { label: 'Modèle', value: data.vehicules.model },
                    { label: 'Immatriculation', value: data.vehicules.immat },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                ${anomalieAlert}
                <p class="closing">Bonne route, et à bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'success',
                eyebrow: 'Réservation validée',
                title: 'Votre véhicule est réservé',
                subtitle: `${data.vehicules.marque} ${data.vehicules.model} — ${data.vehicules.immat}`,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation véhicule validée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailConfirmationVehicule = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Votre réservation de véhicule sur le secteur <strong>${data.secteurs.name}</strong> a bien été enregistrée et est <strong>directement validée</strong>.</p>
                ${buildCard('Récapitulatif de la réservation', [
                    { label: 'Marque', value: data.vehicules.marque },
                    { label: 'Modèle', value: data.vehicules.model },
                    { label: 'Immatriculation', value: data.vehicules.immat },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                ${anomalieAlert}
                <p class="closing">Bonne route, et à bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'success',
                eyebrow: 'Réservation confirmée',
                title: 'Votre véhicule est réservé',
                subtitle: `${data.vehicules.marque} ${data.vehicules.model} — ${data.vehicules.immat}`,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Confirmation de réservation véhicule - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation." });
        }
    };

    const sendEmailConfirmationSalle = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Votre réservation de salle sur le secteur <strong>${data.secteurs.name}</strong> a bien été enregistrée et est <strong>directement validée</strong>.</p>
                ${buildCard('Récapitulatif de la réservation', [
                    { label: 'Salle', value: data.salles.name },
                    { label: 'Adresse', value: data.salles.adresse },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'success',
                eyebrow: 'Réservation confirmée',
                title: 'Votre salle est réservée',
                subtitle: data.salles.name,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Confirmation de réservation salle - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation." });
        }
    };

    const sendEmailValidationSalle = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Bonne nouvelle ! Le secteur <strong>${data.secteurs.name}</strong> a validé votre demande de réservation de salle.</p>
                ${buildCard('Récapitulatif de la réservation', [
                    { label: 'Salle', value: data.salles.name },
                    { label: 'Adresse', value: data.salles.adresse },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'success',
                eyebrow: 'Réservation validée',
                title: 'Votre salle est réservée',
                subtitle: data.salles.name,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation salle validée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailRefusVehicule = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Le secteur <strong>${data.secteurs.name}</strong> n'a pas pu donner suite à votre demande de réservation de véhicule.</p>
                ${buildCard('Récapitulatif de la demande', [
                    { label: 'Marque', value: data.vehicules.marque },
                    { label: 'Modèle', value: data.vehicules.model },
                    { label: 'Immatriculation', value: data.vehicules.immat },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                ${buildNote('Vous pouvez effectuer une nouvelle demande directement depuis l\'application Résa-Pro.')}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'danger',
                eyebrow: 'Demande refusée',
                title: 'Votre demande n\'a pas été retenue',
                subtitle: `${data.vehicules.marque} ${data.vehicules.model} — ${data.vehicules.immat}`,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation véhicule refusée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailRefusSalle = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Le secteur <strong>${data.secteurs.name}</strong> n'a pas pu donner suite à votre demande de réservation de salle.</p>
                ${buildCard('Récapitulatif de la demande', [
                    { label: 'Salle', value: data.salles.name },
                    { label: 'Adresse', value: data.salles.adresse },
                    { label: 'Début', value: `${dateDebut} à ${heureDebut}` },
                    { label: 'Fin', value: `${dateFin} à ${heureFin}` },
                ])}
                ${buildNote('Vous pouvez effectuer une nouvelle demande directement depuis l\'application Résa-Pro.')}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'danger',
                eyebrow: 'Demande refusée',
                title: 'Votre demande n\'a pas été retenue',
                subtitle: data.salles.name,
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation salle refusée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailAnnulation = async (data) => {
        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Un administrateur a été contraint d'<strong>annuler votre réservation</strong>.</p>
                ${buildNote('Connectez-vous à l\'application Résa-Pro pour consulter les détails ou effectuer une nouvelle demande.')}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'danger',
                eyebrow: 'Réservation annulée',
                title: 'Votre réservation a été annulée',
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation annulée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailModification = async (data) => {
        try {
            const body = `
                <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                <p>Un administrateur a apporté <strong>des modifications à votre réservation</strong>.</p>
                ${buildNote('Connectez-vous à l\'application Résa-Pro pour consulter les détails de la modification.')}
                <p class="closing">À bientôt sur Résa-Pro.</p>
            `;

            const html = buildTemplate({
                palette: 'warning',
                eyebrow: 'Réservation modifiée',
                title: 'Votre réservation a été modifiée',
                body,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation modifiée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    return { sendEmail, sendEmailValidationVehicule, sendEmailConfirmationVehicule, sendEmailValidationSalle, sendEmailConfirmationSalle, sendEmailRefusVehicule, sendEmailRefusSalle, sendEmailAnnulation, sendEmailModification }

}
