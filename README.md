# Assistente Fiscale AI - Allcore

Un chatbot intelligente per la consulenza fiscale alle PMI italiane, sviluppato per Allcore Spa.

---

## Panoramica

Questo progetto implementa un **assistente virtuale** specializzato in consulenza fiscale per piccole e medie imprese. L'assistente utilizza:

- **RAG (Retrieval-Augmented Generation)**: recupera informazioni rilevanti da una knowledge base di documenti fiscali prima di rispondere
- **OpenAI GPT-4**: genera risposte accurate e contestualizzate
- **Streaming in tempo reale**: le risposte appaiono progressivamente, migliorando l'esperienza utente
- **Cronologia chat persistente**: le conversazioni vengono salvate localmente con naming automatico AI

---

## Funzionalita Principali

### Chat Intelligente
- Risposte in streaming in tempo reale
- Suggerimenti di domande frequenti
- Restrizione automatica agli argomenti fiscali (rifiuta domande non pertinenti)
- Contatti aziendali disponibili su richiesta

### Gestione Conversazioni
- **Sidebar** con lista di tutte le chat salvate
- **Naming automatico AI**: ogni chat viene rinominata automaticamente in base al contenuto
- **Persistenza locale**: le chat vengono salvate in localStorage e sopravvivono al refresh
- **Eliminazione chat**: possibilita di eliminare singole conversazioni
- **Raggruppamento per data**: Oggi, Ieri, Ultimi 7 giorni, Precedenti

### Design Responsive
- Layout con sidebar collassabile
- Animazioni fluide per apertura/chiusura sidebar
- Header fisso con area chat scrollabile
- Supporto mobile con overlay

---

## Architettura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────>│     Backend     │────>│    OpenAI API   │
│   (Next.js)     │     │   (FastAPI)     │     │    (GPT-4)      │
│                 │<────│                 │<────│                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                │
                                v
                       ┌─────────────────┐
                       │   Knowledge     │
                       │     Base        │
                       │  (Documenti     │
                       │   Fiscali)      │
                       └─────────────────┘
```

### Perche Frontend e Backend Separati?

Questa e un'architettura **monorepo** standard nell'industria:

- **Linguaggi diversi**: TypeScript per UI, Python per AI/ML (ecosistema migliore)
- **Deploy indipendente**: Frontend su Vercel, Backend su qualsiasi server
- **Scalabilita separata**: Puoi scalare il backend senza toccare il frontend
- **Team paralleli**: Sviluppatori frontend e backend lavorano senza conflitti

### Frontend (Next.js 16 + React 19)
- Interfaccia utente moderna e responsive
- Design ispirato allo stile Allcore (blu #1e73be)
- Streaming delle risposte in tempo reale
- Gestione stato con React Context + useReducer
- Tailwind CSS v4 per styling

### Backend (Python/FastAPI)
- API RESTful con endpoint `/api/chat`
- Sistema RAG con TF-IDF per il recupero documenti
- Streaming SSE per risposte in tempo reale
- System prompt ottimizzato con restrizioni tematiche

---

## Knowledge Base

Il sistema RAG utilizza 6 documenti fiscali specializzati:

| Documento | Contenuto |
|-----------|-----------|
| `deduzioni_auto_aziendale.md` | Deducibilita costi auto per PMI |
| `regime_forfettario.md` | Requisiti e vantaggi del forfettario |
| `scadenze_fiscali_2026.md` | Calendario adempimenti fiscali |
| `credito_imposta_investimenti.md` | Agevolazioni Industria 4.0 |
| `spese_rappresentanza.md` | Limiti deducibilita spese |
| `fatturazione_elettronica.md` | Obblighi e procedure |

---

## Flusso di una Domanda

```
1. UTENTE invia domanda
        │
        v
2. VERIFICA ARGOMENTO (solo fiscalita)
        │
        v
3. RAG SYSTEM cerca documenti rilevanti
        │
        v
4. CONTEXT INJECTION inietta il contesto nel prompt
        │
        v
5. GPT-4 genera risposta informata
        │
        v
6. STREAMING risposta progressiva all'utente
        │
        v
7. AI NAMING genera titolo chat (se nuova)
```

**Esempio**: "Posso dedurre l'auto aziendale?"
- Il RAG trova `deduzioni_auto_aziendale.md`
- Inietta le informazioni sulla deducibilita (20%, 70%, 80%)
- GPT-4 risponde con dati precisi dalla normativa

---

## Stack Tecnologico

| Layer | Tecnologia | Motivazione |
|-------|------------|-------------|
| Frontend | Next.js 16 + React 19 + Tailwind v4 | Performance, SSR, styling rapido |
| State | React Context + useReducer | Gestione stato multi-chat |
| Persistence | localStorage | Persistenza client-side senza database |
| Backend | FastAPI + Python | Async nativo, documentazione automatica |
| AI | OpenAI GPT-4 | Qualita risposte, affidabilita |
| RAG | TF-IDF + scikit-learn | Leggero, nessuna dipendenza esterna |

---

## Setup Locale

### Prerequisiti
- Node.js 18+
- Python 3.10+ (consigliato 3.12)
- OpenAI API Key

### Installazione

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Configura .env con la tua API key
echo OPENAI_API_KEY=sk-... > .env

# Avvia backend (porta 8001)
uvicorn app.main:app --reload --port 8001
```

```bash
# Frontend (nuovo terminale)
cd frontend
npm install
npm run dev
```

### URL
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

---

## Struttura Progetto

```
allcore/
├── frontend/
│   ├── src/
│   │   ├── app/              # Pages e layout Next.js
│   │   ├── components/       # AppShell, Sidebar, Chat, Header, InputBar, Message
│   │   └── lib/              # API client, ChatContext, storage, types
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── routers/          # Endpoint /api/chat
│   │   ├── services/         # OpenAI + RAG
│   │   └── prompts/          # System prompt con restrizioni
│   ├── data/documents/       # Knowledge base (6 documenti)
│   └── requirements.txt
│
└── README.md
```

---

## Comportamento Chatbot

### Argomenti Permessi
- Fiscalita, tasse, imposte, tributi
- Regime forfettario, ordinario, semplificato
- IVA, fatturazione elettronica
- Deduzioni, detrazioni fiscali
- Crediti d'imposta, agevolazioni
- Adempimenti fiscali, scadenze
- Contributi INPS/INAIL
- Contabilita aziendale, bilancio

### Argomenti Rifiutati
Qualsiasi domanda non fiscale (ricette, sport, film, viaggi, etc.) viene cortesemente rifiutata con un messaggio standard.

### Contatti Aziendali
Su richiesta dell'utente ("parlare con un operatore", "contatti", etc.), il chatbot fornisce:
- **Investor Relation**: Francesco Grieco - investor.relation@allcore.it
- **Media Relation**: Veronica Crippa - v.crippa@allcore.it
- **Euronext Growth Advisor**: Gianpiero di Perna (Alantra)

---

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/` | Info API |
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Chat con streaming |

---

## Demo - Domande di Test

Prova queste domande per dimostrare le capacita del sistema:

1. **"Posso dedurre l'auto aziendale?"**
   - Mostra il RAG in azione con dati specifici sulle percentuali

2. **"Quali sono i requisiti per il regime forfettario?"**
   - Risposta dettagliata con limiti di fatturato

3. **"Scadenze fiscali di febbraio"**
   - Calendario preciso degli adempimenti

4. **"Come fare una torta?"**
   - Rifiuto cortese (argomento non fiscale)

5. **"Vorrei parlare con un operatore"**
   - Fornisce i contatti aziendali Allcore

---

## Possibili Evoluzioni

- **Vector Database**: Migrare a ChromaDB/Pinecone per RAG semantico
- **Multi-tenancy**: Supporto per piu aziende con knowledge base separate
- **Analytics**: Dashboard per analizzare le domande piu frequenti
- **Autenticazione**: Login utente con sync cloud delle chat
- **Voice**: Integrazione speech-to-text per accessibilita

---
