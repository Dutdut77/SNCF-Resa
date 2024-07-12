export const useFormatDate = () => {

  
    // const test = useState('test', () => ({
    //     test : "test"
    // }))
  
  

// A partir d'un timestamp, récupére un objet contenant le nom du jour, numéro, mois, annee, heure, minute
    const formatedDate = (timestamp) => {
        const result = {};
        // Créer une nouvelle date à partir du timestamp
        let date = new Date(timestamp);
      
        // Obtenir les différentes parties de la date et de l'heure
        let day = date.getDate();
        let month = date.getMonth() + 1; // Les mois commencent à 0, donc nous ajoutons 1
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let dayOfWeek = date.getDay();
      
        // Formater les parties de la date pour ajouter des zéros si nécessaire
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
      
        // Tableau des noms des jours et mois en français
        const dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
        const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
      
        result.jourName = dayNames[dayOfWeek];
        result.jour = day;
        result.mois = monthNames[date.getMonth()];
        result.annee = year;
        result.heure = hours;
        result.minute = minutes;
      
        return result;
      };
      
// Convertir le numéro du mois en lettre. 0 étant le mois de Janvier      
    const monthLetter = (month) => {
        if (month == 0) return "Janvier";
        if (month == 1) return "Février";
        if (month == 2) return "Mars";
        if (month == 3) return "Avril";
        if (month == 4) return "Mai";
        if (month == 5) return "Juin";
        if (month == 6) return "Juillet";
        if (month == 7) return "Aout";
        if (month == 8) return "Septembre";
        if (month == 9) return "Octobre";
        if (month == 10) return "Novembre";
        if (month == 11) return "Décembre";
    };   

    // Convertir un timestamp en 01/12/24 
    const timestampToDateFr = (timestamp) => {
        const data = parseInt(timestamp, 10);
        const date = new Date(data);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
        const year = String(date.getFullYear()).slice(-2);

        return `${day}/${month}/${year}`
    }; 

        // Convertir un timestamp en 10h30 
        const timestampToHeure = (timestamp) => {
            const data = parseInt(timestamp, 10);
            const date = new Date(data);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
          
            return `${hours}h${minutes}`;
        }; 
  
  
      return { formatedDate, monthLetter,timestampToDateFr, timestampToHeure}
      
  }