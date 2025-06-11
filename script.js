function tempsEnSecondes(temps) {
    const match = temps.match(/(\d+)min(\d+)/);
    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
}

function secondesEnTemps(sec) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}min${s.toString().padStart(2, '0')}`;
}

fetch('donnees.txt')
    .then(response => response.text())
    .then(txt => {
        const lignes = txt.trim().split('\n');
        const tableau = document.getElementById('tableau');
        const recordElt = document.querySelector('.record');

        if (lignes.length === 0) return;

        const enTetes = lignes[0].split(',').map(e => e.trim());
        enTetes.push('Total');

        let record = {
            tempsSec: 0,
            prenom: '',
            date: ''
        };

        const thead = document.createElement('thead');
        const ligneEnTete = document.createElement('tr');
        enTetes.forEach(titre => {
            const th = document.createElement('th');
            th.textContent = titre;
            ligneEnTete.appendChild(th);
        });
        thead.appendChild(ligneEnTete);
        tableau.appendChild(thead);

        const tbody = document.createElement('tbody');

        for (let i = 1; i < lignes.length; i++) {
            const valeurs = lignes[i].split(',').map(e => e.trim());
            const tr = document.createElement('tr');

            let totalSec = 0;
            const prenom = valeurs[0];

            tr.appendChild(Object.assign(document.createElement('td'), {textContent: prenom}));

            for (let j = 1; j < enTetes.length - 1; j++) {
                const val = valeurs[j] || '';
                const td = document.createElement('td');
                td.textContent = val;
                tr.appendChild(td);

                const sec = tempsEnSecondes(val);
                if (sec > 0) {
                    totalSec += sec;

                    if (sec > record.tempsSec) {
                        record = {
                            tempsSec: sec,
                            prenom: prenom,
                            date: enTetes[j]
                        };
                    }
                }
            }

            const tdTotal = document.createElement('td');
            tdTotal.textContent = secondesEnTemps(totalSec);
            tr.appendChild(tdTotal);

            tbody.appendChild(tr);
        }

        tableau.appendChild(tbody);

        if (record.tempsSec > 0) {
            recordElt.textContent = `🏆 Le record est de ${secondesEnTemps(record.tempsSec)}, détenu par ${record.prenom} le ${record.date}`;
        } else {
            recordElt.textContent = `🏆 Aucun record enregistré`;
        }
    })
    .catch(err => {
        console.error("Erreur chargement données :", err);
});