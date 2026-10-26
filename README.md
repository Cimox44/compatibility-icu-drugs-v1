# ICU Pharma Cardio — v2.0 (26/10/2026)

PWA di supporto per la terapia infusionale in Terapia Intensiva Cardiochirurgica: 188 farmaci, compatibilità in Y, simulatore di lume, accesso vascolare, calcolatore di titolazione, boli ed emergenze.

> Strumento di supporto decisionale. Non sostituisce RCP, protocolli aziendali né la consulenza del farmacista. Assenza di dato ≠ compatibilità.

## File
| File | Ruolo |
|---|---|
| index.html | interfaccia |
| app.js | dati dei 188 farmaci, motore di compatibilità, calcolatore |
| style.css | grafica |
| manifest.json | installazione come app |
| sw.js | funzionamento offline (cache `icu-pharma-cardio-v2.0`) |
| icon-192.png, icon-512.png, icon-512-maskable.png | icone |
| README.md | questo file |

## Novità v2.0
**Calcolatore (riscritto)**
- Le modalità in mg (mg/h, mg/kg/h) davano «0,00 mL/h» (propofol, furosemide, amiodarone, fentanil, dexmedetomidina): ora tutte le unità sono convertite correttamente (ng, mcg, mg, g, UI, mEq; per kg; per min/h).
- Il peso vuoto non viene più sostituito da 70 kg: il calcolo per kg si blocca con un avviso.
- Il cambio di unità converte la dose (la velocità resta invariata).
- Calcolo bidirezionale dose ⇄ mL/h; preset per circa 50 farmaci; avvisi per valori negativi, unità non convertibili, < 0,1 e > 200 mL/h.

**Motore di compatibilità in Y**
- 11 coppie con dati discordanti in letteratura → «Dati discordanti — linee separate».
- Soglie del pH ora inclusive (≥ 9, ≥ 8).
- Farmaci che richiedono linea dedicata: una compatibilità riportata diventa «Attenzione».

**Correzioni cliniche**: enoximone (diluente e contenitori, RCP), fenilefrina (categoria), terlipressina (EMA 2022), angiotensina II (concentrazione × 1000), nitroglicerina, amiodarone (RCP italiano), adenosina (ERC 2021), propofol (PADIS 2025, età ≤16 anni), dexmedetomidina (PADIS 2025, DECADE), cisatracurio (RCP ICU, reversal), eparina (ELSO 2021), calcio gluconato, paracetamolo.

**PWA**: manifest e icone reali, service worker (prima la rete per la pagina, cache per i file), funzionamento offline.

## Aggiornare
1. Caricare tutti i file nella radice della repository (Add file → Upload files → Commit).
2. A ogni modifica aumentare la versione `CACHE` in `sw.js` (es. `icu-pharma-cardio-v2.1`) e `BUILD` in `app.js`.
3. Sul telefono: aprire l'app online e chiuderla/riaprirla due volte; se resta la versione vecchia, disinstallarla e reinstallarla.

## Limiti
Le coppie di compatibilità non sono state riverificate una per una su Trissel's/Stabilis: validarle con la farmacia ospedaliera prima dell'uso clinico.
