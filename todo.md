# RistoAI Web App - TODO

## Database Schema
- [x] Tabella `restaurants` per informazioni ristorante
- [x] Tabella `bookings` per prenotazioni
- [x] Tabella `menu_items` per piatti del menu
- [x] Tabella `chat_conversations` per storico conversazioni
- [x] Tabella `chat_messages` per messaggi individuali
- [x] Tabella `analytics` per metriche e statistiche

## Backend (tRPC Procedures)
- [x] Router `restaurant` per gestione info ristorante
- [x] Router `booking` per CRUD prenotazioni
- [x] Router `menu` per gestione menu
- [x] Router `chat` per conversazioni con AI
- [x] Integrazione GPT-4 per chatbot intelligente
- [x] Router `analytics` per dashboard metriche

## Frontend UI/UX
- [x] Design system con palette colori italiana (terracotta, verde oliva, dorato)
- [x] Pagina Home/Landing con presentazione RistoAI
- [x] Dashboard ristoratore con sidebar navigation
- [ ] Pagina gestione prenotazioni
- [ ] Pagina gestione menu
- [x] Interfaccia chatbot con demo interattiva
- [x] Pagina analytics con grafici e KPI (dashboard stats)
- [x] Design responsive mobile-first

## PWA Features
- [x] Manifest.json per installazione app
- [x] Icone app per iOS/Android (192x192 e 512x512)
- [x] Meta tags per PWA
- [ ] Service Worker per funzionalità offline (opzionale)

## Funzionalità Chatbot
- [x] Risposta a domande sui piatti (GPT-4 con contesto menu)
- [x] Assistenza per prenotazioni via chat
- [x] Suggerimenti personalizzati (AI-powered)
- [x] Gestione FAQ comuni (GPT-4)
- [x] Storico conversazioni (salvato in DB)

## Testing & Deployment
- [x] Test funzionalità chatbot (GPT-4 integrato e funzionante)
- [x] Test responsive design (mobile-first verificato)
- [x] Checkpoint per deployment (v1.0 creato)
- [x] Documentazione per demo (landing page completa)
- [ ] Test prenotazioni end-to-end (da completare con utenti reali)
