# CLAUDE.md — Lista de Presentes de Casamento

> Documento de contexto para uso com Claude (ou qualquer LLM).  
> Inclua este arquivo no início de cada conversa para reduzir tokens gastos com re-explicações.

---

## 1. O que é este projeto

Aplicação web de **lista de presentes de casamento** (Cecília & Thiago · 30 Jan 2027).  
Stack: **React + Vite + Firebase (Firestore)**.  
Sem backend próprio — toda a persistência é via Firestore em tempo real.  
Sem autenticação Firebase; o admin usa uma senha hardcoded no front-end.

---

## 2. Estrutura de pastas

```
src/
├── App.jsx                        # Orquestrador: rotas, modais, conecta tudo
├── main.jsx                       # Entry point React (createRoot)
├── firebase.js                    # Config Firebase + helpers Firestore
│
├── styles/
│   └── global.css                 # Todo o CSS da aplicação (CSS variables + classes utilitárias)
│
├── utils/
│   └── format.js                  # fmt(val) → moeda BRL
│
├── hooks/
│   └── useGifts.js                # Hook central: estado, Firebase, CRUD, toast
│
└── components/
    ├── Header.jsx                 # Navegação sticky + logo
    ├── HeroSection.jsx            # Banner da galeria (logo grande, texto)
    ├── GiftCard.jsx               # Card de presente (galeria pública)
    ├── AdminLogin.jsx             # Tela de login admin (senha local)
    ├── AdminDashboard.jsx         # Painel admin: stats + tabela + ações
    └── modals/
        ├── ReservationModal.jsx   # Fluxo de reserva em 3 passos (método → nome → QR)
        ├── GiftFormModal.jsx      # Criar / editar presente
        └── QrConfigModal.jsx      # Configurar URL do QR Code Pix
```

---

## 3. Fluxo de navegação

```
view = "gallery"      → galeria pública (padrão)
view = "admin-login"  → tela de senha (isAdmin = false)
view = "admin"        → painel admin   (isAdmin = true)
```

`view` e `isAdmin` vivem no `App.jsx` como `useState`.  
Troca de view via `setView()` passado como prop para `<Header>`.

---

## 4. Responsabilidades por arquivo

### `App.jsx`
- Único dono de `view`, `isAdmin`, `selectedGift`, `showAddGift`, `editingGift`, `showQrConfig`
- Consome `useGifts()` e distribui dados/callbacks para os filhos via props
- Renderiza condicionalmente as views e os modais
- **Não contém lógica de negócio nem CSS**

### `hooks/useGifts.js`
- Assina `subscribeGifts` (onSnapshot) no mount; cancela no unmount
- Carrega QR Code inicial com `getQrCode()`
- Expõe: `gifts`, `qrCode`, `stats`, `filter`, `setFilter`, `filteredGifts`
- Expõe operações: `saveGift(data, editingGift?)`, `deleteGiftById(id)`, `confirmReservation(giftId, name, method)`, `releaseGift(id)`, `handleSaveQr(url)`
- Expõe toast: `toast`, `showToast(msg, type)`
- `stats` é derivado (useMemo implícito): `total`, `available`, `reserved`, `confirmed`, `totalValue`, `collectedValue`
- `filteredGifts` filtra por `filter` ∈ `"all" | "available" | "reserved"`

### `firebase.js`
- Inicializa Firebase com variáveis de ambiente Vite (`import.meta.env.VITE_*`)
- Exporta: `db`, `giftsCollection`
- Funções: `subscribeGifts(cb)`, `addGift(data)`, `updateGift(id, data)`, `deleteGift(id)`
- Funções QR: `saveQrCode(url)`, `getQrCode()`
- Coleções Firestore: `gifts` (documentos de presentes), `settings/qrcode` (documento único)

### `styles/global.css`
- CSS variables em `:root` — paleta verde-oliva/creme
- Classes reutilizáveis: `.btn`, `.btn-{primary|outline|gold|danger|sm}`, `.modal`, `.modal-overlay`, `.form-input`, `.form-label`, `.gift-card`, `.stat-card`, `.admin-table`, `.filter-chip`, `.toast`, `.step-item`, `.payment-option`
- Breakpoint mobile: `max-width: 640px`
- Fontes: `Cormorant Garamond` (display/títulos) + `Jost` (corpo)
- **Nunca usar `<style>` inline nos componentes** — sempre estender este arquivo

### `utils/format.js`
- `fmt(val)` → `"R$ 1.250,00"` (Intl, pt-BR, BRL)
- Importar onde precisar de moeda; não duplicar

---

## 5. Modelo de dados (Firestore)

### Coleção `gifts` — documento de presente
```js
{
  id: string,           // gerado pelo Firestore
  name: string,         // "Jogo de Panelas Tramontina"
  description: string,
  price: number,        // float, ex: 349.90
  emoji: string,        // "🍳"
  imageUrl: string,     // URL externa ou Firebase Storage (opcional)
  link: string,         // link do produto na loja (opcional)
  status: "available" | "reserved" | "confirmed",
  reservedBy: null | {
    name: string,       // "Maria Silva"
    method: "pix" | "presencial"
  }
}
```

### Documento `settings/qrcode`
```js
{ url: string }  // URL da imagem do QR Code Pix
```

---

## 6. Fluxo de reserva (`ReservationModal`)

Wizard de 3 passos interno ao componente (estado local):

```
Passo 1 — Método:   pix | presencial | outro
Passo 2 — Nome:     firstName + lastName
Passo 3 — QR Code:  (apenas se method === "pix")
```

Ao confirmar:
- `pix` → `status: "confirmed"`, `reservedBy.method: "pix"`
- `presencial` / `outro` → `status: "reserved"`, `reservedBy.method: "presencial"`

Callback: `onConfirm(giftId, fullName, method)` — chama `confirmReservation` do hook.

---

## 7. Autenticação admin

- Senha hardcoded: `"casamento2025"` em `AdminLogin.jsx`
- Ao acertar: `isAdmin = true`, `view = "admin"`, toast de boas-vindas
- Sem persistência de sessão (logout ao recarregar)
- **Para produção:** mover senha para variável de ambiente ou usar Firebase Auth

---

## 8. Design system (CSS variables)

| Variável        | Valor           | Uso principal              |
|-----------------|-----------------|----------------------------|
| `--cream`       | `#F4F5EE`       | Background geral           |
| `--gold`        | `#6B7A3A`       | Primário (botões, preços)  |
| `--gold-light`  | `#8C9E50`       | Hover de dourado           |
| `--gold-pale`   | `#E8EDD6`       | Fundos suaves, seleção     |
| `--dark`        | `#1E2410`       | Texto principal, btn dark  |
| `--mid`         | `#4A5528`       | Texto secundário           |
| `--light`       | `#7D8C58`       | Placeholders, labels       |
| `--sage`        | `#5C7A3E`       | Status "confirmado"        |
| `--border`      | `rgba(107,122,58,0.25)` | Bordas         |
| `--shadow`      | `0 2px 24px ...`| Sombra dos cards           |

Fontes: `font-family: 'Cormorant Garamond'` (`.font-display`) e `'Jost'` (padrão).

---

## 9. Convenções do projeto

- **Componentes:** PascalCase, um por arquivo, sem default export anônimo
- **Props:** callbacks nomeados como `on{Ação}` (ex: `onSave`, `onClose`, `onLogin`)
- **Estado local vs. global:** estado de UI (step do wizard, valor de input) fica no componente; estado de dados e operações Firebase ficam no hook
- **Sub-componentes locais:** quando um componente tem uma peça reutilizável só dentro dele (ex: `StatCard` em `AdminDashboard`, `PaymentOption` em `ReservationModal`), declarar no mesmo arquivo, abaixo do export default
- **Sem inline styles de cor:** usar variáveis CSS (`color: "var(--gold)"`) em vez de hex direto
- **Sem `<style>` em JSX:** todo CSS vai para `global.css`
- **Sem `fmt` local:** sempre importar de `utils/format.js`

---

## 10. Como adicionar funcionalidades (guia rápido)

### Nova view/página
1. Adicionar `"nome-da-view"` ao controle de `view` no `App.jsx`
2. Criar `src/components/NomeDaView.jsx`
3. Adicionar botão no `Header.jsx` se precisar de nav
4. Renderizar condicionalmente no `App.jsx`

### Nova operação Firebase
1. Adicionar a função em `firebase.js`
2. Consumi-la no `useGifts.js` (ou criar novo hook se for domínio diferente)
3. Expor via retorno do hook
4. Chamar no componente via prop/callback do `App.jsx`

### Novo campo no presente
1. Atualizar o objeto `form` inicial em `GiftFormModal.jsx`
2. Adicionar o input no JSX do formulário
3. Atualizar onde o campo é exibido (`GiftCard.jsx`, `AdminDashboard.jsx`)
4. O Firestore aceita campos novos automaticamente

### Novo modal
1. Criar em `src/components/modals/NovoModal.jsx`
2. Adicionar `showNovoModal` + `setShowNovoModal` no `App.jsx`
3. Renderizar condicionalmente no bloco de modais do `App.jsx`

---

## 11. Variáveis de ambiente necessárias (`.env`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 12. O que este projeto NÃO tem (e pode ser adicionado)

- Autenticação real (Firebase Auth)
- Paginação ou busca por texto na galeria
- Notificações por e-mail ao reservar
- Upload direto de imagem (hoje usa URL externa)
- Internacionalização (i18n)
- Testes automatizados
- Deploy CI/CD configurado