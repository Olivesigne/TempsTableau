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
        const totalPerduElt = document.querySelector('.total-perdu');

        if (lignes.length === 0) return;

        const enTetes = lignes[0].split(',').map(e => e.trim());
        enTetes.push('Total');

        let record = { tempsSec: 0, prenom: '', date: '' };
        let totalGlobal = 0;
        const participants = [];

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
            const tds = [prenom];

            for (let j = 1; j < enTetes.length - 1; j++) {
                const val = valeurs[j] || '';
                const sec = tempsEnSecondes(val);
                totalSec += sec;
                if (sec > record.tempsSec) {
                    record = {
                        tempsSec: sec,
                        prenom: prenom,
                        date: enTetes[j]
                    };
                }
                tds.push(val);
            }

            tds.push(secondesEnTemps(totalSec));
            participants.push({ prenom, tds, totalSec });
            totalGlobal += totalSec;
        }

        participants.sort((a, b) => b.totalSec - a.totalSec);

        const medailles = ['🥇', '🥈', '🥉'];

        participants.forEach((p, index) => {
            const tr = document.createElement('tr');
            p.tds.forEach((val, i) => {
                const td = document.createElement('td');
                if (i === 0 && index < 3) {
                    td.textContent = `${medailles[index]} ${val}`;
                } else {
                    td.textContent = val;
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        tableau.appendChild(tbody);

        if (record.tempsSec > 0) {
            recordElt.textContent = `🏆 Le record est de ${secondesEnTemps(record.tempsSec)}, détenu par ${record.prenom} le ${record.date}`;
        } else {
            recordElt.textContent = `🏆 Aucun record enregistré`;
        }

        totalPerduElt.textContent = `🎯 Temps perdu : ${secondesEnTemps(totalGlobal)}`;
    })
    .catch(err => {
        console.error("Erreur chargement données :", err);
    });
