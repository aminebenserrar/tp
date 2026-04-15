Q1 : Le script s'exécute-t-il ? Pourquoi ? Que fait React avec les strings dans le JSX ?

Non, le script ne s'exécute pas. React échappe automatiquement les strings dans le JSX. Le HTML malveillant comme <img src=x onerror=alert("HACK")> est affiché comme du texte brut, pas interprété. React active cette protection par défaut pour tous les strings en JSX.

Q2 : Que se passe-t-il avec dangerouslySetInnerHTML ?

Avec dangerouslySetInnerHTML, le script s'exécute. Cette méthode désactive la protection de React. En production, jamais avec des données utilisateur ou API car c'est une porte ouverte aux attaques XSS.

Partie 2 : Authentification JWT simulée

Q3 : Ouvrez Network (F12). Faites un GET /projects. Voyez-vous le header Authorization: Bearer ... ?

Oui. L'intercepteur Axios (src/api/axios.ts) ajoute automatiquement le header Authorization: Bearer {token} à chaque requête. La fonction setAuthToken() est appelée dans Login.tsx après un login réussi.

Q4 : Pourquoi stocker le token en mémoire (state React) et pas dans localStorage ?

localStorage est accessible par tout script JS de la page (XSS). Un attaquant qui injecte du code peut voler le token. Le state React est isolé dans Redux et n'est pas accessible par des scripts externes. Le défaut du state: le token est perdu au refresh, mais c'est moins grave qu'une attaque XSS. En production, utiliser les httpOnly cookies.

Partie 3 : Migration vers Redux Toolkit

Q5 : Comparez authSlice.ts avec votre ancien authReducer.ts. Qu'est-ce qui a changé ?

Redux Toolkit utilise Immer en coulisse. Avant, on écrivait return { ...state, user: action.payload } avec spread operator. Maintenant on écrit state.user = action.payload; qui semble mutable mais crée un nouvel objet automatiquement. Plus de switch/case manuels. createSlice génère automatiquement les actions. Le code est plus concis et lisible, moins d'erreurs.

Partie 4 : Performance - React.memo & useCallback

Q6 : Combien de composants se re-rendent quand on toggle la sidebar ? Lesquels ne DEVRAIENT PAS ?

Avant React.memo: Dashboard, Header, Sidebar et MainContent se re-rendent tous. Après React.memo: Dashboard, Header, Sidebar se re-rendent. MainContent ne se re-rend plus car React.memo détecte que les props (columns) n'ont pas changé.

Q7 : Pourquoi MainContent ne se re-rend plus ? Que compare React.memo ?

React.memo compare les props du composant avec une shallow comparison. Si columns reste la même référence, pas de re-render. Quand les props changent, le composant se re-rend normalement. Finalement, MainContent ne se re-rend que si ses props changent.

Q8 : Quelle différence entre useMemo et useCallback ? Quand utiliser chacun ?

useMemo memoize une valeur calculée. useCallback memoize une fonction. Utiliser useCallback quand on passe une fonction à un composant memoizé (évite re-renders inutiles). Utiliser useMemo quand une valeur coûteuse à calculer ne change pas souvent.

Partie 5 : Custom Hook useProjects

La logique CRUD a été extraite dans un custom hook (src/hooks/useProjects.ts). Ce hook charge les projets et colonnes au montage, fournit addProject(name, color) pour POST, renameProject(project) pour PUT, et deleteProject(id) pour DELETE.

Partie 6 : React Profiler

Q10 : Pour chaque action, notez : quels composants se re-rendent ? Combien de temps prend le render ? Y a-t-il des re-renders inutiles apres optimisations React.memo ?

Toggle sidebar: Dashboard, Header, Sidebar se re-rendent. MainContent non (memoizé). Ajouter projet: Dashboard, Sidebar se re-rendent. Naviguer: Dashboard, ProjectDetail se re-rendent. Déconnexion: Dashboard, Header se re-rendent.