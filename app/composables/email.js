export const useEmail = () => {

    const { addToast } = useToast();
    const { timestampToDateFr, timestampToHeure } = useFormatDate();

    const buildTemplate = ({ headerColor, headerTitle, headerIcon, bodyContent }) => {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f7fafc;
        }
        .wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: ${headerColor};
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }
        .header .icon {
            font-size: 36px;
            margin-bottom: 10px;
        }
        .body-content {
            padding: 30px 35px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 15px;
        }
        .body-content p {
            margin: 8px 0;
            font-size: 15px;
            color: #4a5568;
        }
        .recap-box {
            background-color: #f7fafc;
            border-left: 4px solid ${headerColor};
            border-radius: 4px;
            padding: 18px 22px;
            margin: 20px 0;
        }
        .recap-box h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #718096;
        }
        .recap-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .recap-box li {
            padding: 6px 0;
            font-size: 14px;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
        }
        .recap-box li:last-child {
            border-bottom: none;
        }
        .recap-box li strong {
            color: #1a202c;
            min-width: 130px;
            display: inline-block;
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px 35px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 4px 0;
            font-size: 12px;
            color: #a0aec0;
        }
        .footer .app-name {
            font-weight: 600;
            color: #718096;
        }
        .cta-text {
            background-color: #edf2f7;
            border-radius: 6px;
            padding: 14px 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
            color: #4a5568;
        }
    </style>
</head>
<body style="margin:0; padding:20px 0; background-color:#f7fafc;">
    <div class="wrapper">
        <div class="header">
            <div class="icon">${headerIcon}</div>
            <h1>${headerTitle}</h1>
        </div>
        <div class="body-content">
            ${bodyContent}
        </div>
        <div class="footer">
            <p class="app-name">Résa-Pro</p>
            <p>Application de réservation SNCF - INFPE</p>
            <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>`;
    };

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
            const html = buildTemplate({
                headerColor: '#0369a1',
                headerTitle: 'Nouvelle demande de réservation',
                headerIcon: '📋',
                bodyContent: `
                    <p class="greeting">Bonjour,</p>
                    <p><strong>${profil.prenom} ${profil.nom}</strong> a effectué une demande de réservation depuis l'application Résa-Pro.</p>
                    <div class="recap-box">
                        <h3>Informations du demandeur</h3>
                        <ul>
                            <li><strong>Nom :</strong> ${profil.nom}</li>
                            <li><strong>Prénom :</strong> ${profil.prenom}</li>
                            <li><strong>Email :</strong> ${profil.email}</li>
                        </ul>
                    </div>
                    <div class="cta-text">
                        En tant qu'administrateur, merci de valider ou refuser cette demande depuis votre espace administrateur.
                    </div>
                `,
            });

            await doSend(liste, `Résa-Pro : Nouvelle demande de ${profil.prenom} ${profil.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailValidationVehicule = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const html = buildTemplate({
                headerColor: '#16a34a',
                headerTitle: 'Réservation validée',
                headerIcon: '✅',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Bonne nouvelle ! Le secteur <strong>${data.secteurs.name}</strong> a validé votre demande de réservation de véhicule.</p>
                    <div class="recap-box">
                        <h3>Récapitulatif de votre réservation</h3>
                        <ul>
                            <li><strong>Marque :</strong> ${data.vehicules.marque}</li>
                            <li><strong>Modèle :</strong> ${data.vehicules.model}</li>
                            <li><strong>Immatriculation :</strong> ${data.vehicules.immat}</li>
                            <li><strong>Début :</strong> ${dateDebut} à ${heureDebut}</li>
                            <li><strong>Fin :</strong> ${dateFin} à ${heureFin}</li>
                        </ul>
                    </div>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation véhicule validée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailValidationSalle = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const html = buildTemplate({
                headerColor: '#16a34a',
                headerTitle: 'Réservation validée',
                headerIcon: '✅',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Bonne nouvelle ! Le secteur <strong>${data.secteurs.name}</strong> a validé votre demande de réservation de salle.</p>
                    <div class="recap-box">
                        <h3>Récapitulatif de votre réservation</h3>
                        <ul>
                            <li><strong>Salle :</strong> ${data.salles.name}</li>
                            <li><strong>Adresse :</strong> ${data.salles.adresse}</li>
                            <li><strong>Début :</strong> ${dateDebut} à ${heureDebut}</li>
                            <li><strong>Fin :</strong> ${dateFin} à ${heureFin}</li>
                        </ul>
                    </div>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation salle validée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailRefusVehicule = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const html = buildTemplate({
                headerColor: '#dc2626',
                headerTitle: 'Réservation refusée',
                headerIcon: '❌',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Le secteur <strong>${data.secteurs.name}</strong> n'a pas pu donner suite à votre demande de réservation de véhicule.</p>
                    <div class="recap-box">
                        <h3>Récapitulatif de la réservation</h3>
                        <ul>
                            <li><strong>Marque :</strong> ${data.vehicules.marque}</li>
                            <li><strong>Modèle :</strong> ${data.vehicules.model}</li>
                            <li><strong>Immatriculation :</strong> ${data.vehicules.immat}</li>
                            <li><strong>Début :</strong> ${dateDebut} à ${heureDebut}</li>
                            <li><strong>Fin :</strong> ${dateFin} à ${heureFin}</li>
                        </ul>
                    </div>
                    <div class="cta-text">
                        Vous pouvez effectuer une nouvelle demande directement depuis l'application Résa-Pro.
                    </div>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation véhicule refusée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailRefusSalle = async (data) => {
        const { dateDebut, heureDebut, dateFin, heureFin } = formatDates(data);

        try {
            const html = buildTemplate({
                headerColor: '#dc2626',
                headerTitle: 'Réservation refusée',
                headerIcon: '❌',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Le secteur <strong>${data.secteurs.name}</strong> n'a pas pu donner suite à votre demande de réservation de salle.</p>
                    <div class="recap-box">
                        <h3>Récapitulatif de la réservation</h3>
                        <ul>
                            <li><strong>Salle :</strong> ${data.salles.name}</li>
                            <li><strong>Adresse :</strong> ${data.salles.adresse}</li>
                            <li><strong>Début :</strong> ${dateDebut} à ${heureDebut}</li>
                            <li><strong>Fin :</strong> ${dateFin} à ${heureFin}</li>
                        </ul>
                    </div>
                    <div class="cta-text">
                        Vous pouvez effectuer une nouvelle demande directement depuis l'application Résa-Pro.
                    </div>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation salle refusée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailAnnulation = async (data) => {
        try {
            const html = buildTemplate({
                headerColor: '#dc2626',
                headerTitle: 'Réservation annulée',
                headerIcon: '🚫',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Un administrateur a été contraint d'annuler votre réservation.</p>
                    <p>Merci de vous connecter à l'application Résa-Pro pour plus d'informations.</p>
                    <div class="cta-text">
                        Vous pouvez effectuer une nouvelle demande directement depuis l'application Résa-Pro.
                    </div>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation annulée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    const sendEmailModification = async (data) => {
        try {
            const html = buildTemplate({
                headerColor: '#d97706',
                headerTitle: 'Réservation modifiée',
                headerIcon: '✏️',
                bodyContent: `
                    <p class="greeting">Bonjour ${data.profiles.prenom},</p>
                    <p>Un administrateur a apporté des modifications à votre réservation.</p>
                    <p>Merci de vous connecter à l'application Résa-Pro pour consulter les détails de la modification.</p>
                    <p>À bientôt sur Résa-Pro.</p>
                `,
            });

            await doSend(data.profiles.email, `Résa-Pro : Réservation modifiée - ${data.profiles.prenom} ${data.profiles.nom}`, html);

        } catch (err) {
            addToast({ type: "Error", title: "Problème lors de l'envoi de votre email de confirmation. Votre demande n'est pas enregistrée." });
        }
    };

    return { sendEmail, sendEmailValidationVehicule, sendEmailValidationSalle, sendEmailRefusVehicule, sendEmailRefusSalle, sendEmailAnnulation, sendEmailModification }

}
