# Assistente Fiscale AI - Allcore

Un chatbot intelligente per la consulenza fiscale alle PMI italiane, sviluppato come progetto dimostrativo per Allcore Spa.

---

## Panoramica

Questo progetto implementa un **assistente virtuale** specializzato in consulenza fiscale per piccole e medie imprese. L'assistente utilizza:

- **RAG (Retrieval-Augmented Generation)**: recupera informazioni rilevanti da una knowledge base di documenti fiscali prima di rispondere
- **OpenAI GPT-4**: genera risposte accurate e contestualizzate
- **Streaming in tempo reale**: le risposte appaiono progressivamente, migliorando l'esperienza utente

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

### Frontend (Next.js 14)
- Interfaccia utente moderna e responsive
- Design ispirato allo stile Allcore (blu #1e73be)
- Streaming delle risposte in tempo reale
- Suggerimenti di domande frequenti

### Backend (Python/FastAPI)
- API RESTful con endpoint `/api/chat`
- Sistema RAG con TF-IDF per il recupero documenti
- Streaming SSE per risposte in tempo reale
- System prompt ottimizzato per consulenza fiscale

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
2. RAG SYSTEM cerca documenti rilevanti
        │
        v
3. CONTEXT INJECTION inietta il contesto nel prompt
        │
        v
4. GPT-4 genera risposta informata
        │
        v
5. STREAMING risposta progressiva all'utente
```

**Esempio**: "Posso dedurre l'auto aziendale?"
- Il RAG trova `deduzioni_auto_aziendale.md`
- Inietta le informazioni sulla deducibilita (20%, 70%, 80%)
- GPT-4 risponde con dati precisi dalla normativa

---

## Stack Tecnologico

| Layer | Tecnologia | Motivazione |
|-------|------------|-------------|
| Frontend | Next.js 14 + Tailwind | Performance, SSR, styling rapido |
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
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

---

## Punti Chiave per il Colloquio

### 1. Perche RAG?
> "RAG permette all'assistente di fornire risposte basate su documentazione specifica e aggiornata, riducendo le allucinazioni e garantendo accuratezza normativa."

### 2. Perche Streaming?
> "Lo streaming migliora drasticamente la UX: l'utente vede la risposta formarsi in tempo reale invece di attendere secondi con uno schermo vuoto."

### 3. Prompt Engineering
> "Il system prompt e progettato per:
> - Mantenere un tono professionale ma accessibile
> - Citare le fonti normative (es: Art. X TUIR)
> - Evitare consulenza definitiva, suggerendo sempre verifica professionale"

### 4. Scalabilita
> "Il sistema e modulare: si puo facilmente sostituire TF-IDF con un vector database (Pinecone, ChromaDB) per gestire migliaia di documenti."

---

## Demo - Domande di Test

Prova queste domande per dimostrare le capacita del sistema:

1. **"Posso dedurre l'auto aziendale?"**
   - Mostra il RAG in azione con dati specifici sulle percentuali

2. **"Quali sono i requisiti per il regime forfettario?"**
   - Risposta dettagliata con limiti di fatturato

3. **"Scadenze fiscali di febbraio"**
   - Calendario preciso degli adempimenti

4. **"Come funzionano i crediti d'imposta 4.0?"**
   - Informazioni sulle agevolazioni per investimenti

---

## Possibili Evoluzioni

- **Vector Database**: Migrare a ChromaDB/Pinecone per RAG semantico
- **Multi-tenancy**: Supporto per piu aziende con knowledge base separate
- **Analytics**: Dashboard per analizzare le domande piu frequenti
- **Fine-tuning**: Addestrare un modello specializzato su dati fiscali italiani
- **Voice**: Integrazione speech-to-text per accessibilita

---

## Struttura Progetto

```
allcore/
├── frontend/
│   ├── src/
│   │   ├── app/           # Pages e layout Next.js
│   │   ├── components/    # Chat, Header, InputBar, Message
│   │   └── lib/           # API client
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI entry point
│   │   ├── routers/       # Endpoint /api/chat
│   │   ├── services/      # OpenAI + RAG
│   │   └── prompts/       # System prompt
│   ├── data/documents/    # Knowledge base (6 documenti)
│   └── requirements.txt
│
└── README.md
```

---

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/` | Info API |
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Chat con streaming |

---

Progetto sviluppato come demo per il colloquio presso **Allcore Spa** - Consulenza fiscale per PMI.
