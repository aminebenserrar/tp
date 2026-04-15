Q1 : Pourquoi <Navigate /> (composant) et pas navigate() (hook) ici ?  
Il est impossible d'utiliser les hook dans JSX, contrairement aux composants.

Q2 : Quelle différence entre navigate(from) et navigate(from, { replace: true }) ?  
navigate(from): Ajoute une page dans l’historique.           
navigate(from, { replace: true }): Remplace la page actuelle dans l’historique.  

Q3 : Après un POST, pourquoi fait-on setProjects(prev => [...prev, data]) plutôt qu’un 
re-fetch GET ?  
On utilise setProjects(prev => [...prev, data]) pour mettre à jour l’état local immédiatement et éviter une requête GET supplémentaire, ce qui améliore les performances et réduit le trafic réseau.  

Q4 : Testez ces scenarios.  
a) /dashboard sans être connecté : redirection vers login.  
b) /projects/1 sans être connecté : redirection vers login.  
c) /nimportequoi : redirection vers login.  
d) / (racine) : redirection vers login.  
e) Connecté puis bouton Retour du navigateur : redirection vers login.  

Q5 : Quelle différence entre <Link> et <NavLink> ? Pourquoi NavLink ici ?  
Link : utiliser pour MPA, efectue un rechargement de la page.  
NavLink : utiliser pour SPA, n'effectue aucun rechargement de la page.  

Q6 : Ce composant sert pour le POST ET le PUT. Qu’est-ce qui change entre les deux usages ?  
Pour POST, le formulaire est vide et onSubmit envoie POST /projects.  
Pour PUT, les champs sont pré-remplis (initialName, initialColor) et onSubmit envoie PUT /projects/:id.  

Q7 : Arrêtez json-server et tentez un POST. Le message s’affiche ?   
Oui, le message s'affiche : Erreur undefined.  

Q8 : Avec fetch, un 404 ne lance PAS d’erreur. Avec Axios, que se passe-t-il ?  
fetch : pas d'erreur automatique.  
Axios : erreur automatiquement lancée.  
