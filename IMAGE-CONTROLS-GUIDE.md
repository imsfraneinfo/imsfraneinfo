# Contrôle des images depuis CloudCannon

Ouvrez **🖼️ Réglage des images / Image controls**, puis le fichier correspondant à la page (`fr-blog`, `en-index`, etc.). Pour chaque image, utilisez :

- `description` / `source` : identifier la photo (ne pas modifier son ID).
- `position_x` : 0 = gauche, 50 = centre, 100 = droite.
- `position_y` : 0 = haut, 50 = centre, 100 = bas.
- `zoom` : 100–200 ; 100 = taille normale.
- `fit` : `cover` remplit le cadre (avec recadrage) ; `contain` montre toute la photo (peut laisser des espaces).

Enregistrez et publiez dans CloudCannon. Les fichiers de réglage sont dans `/image-settings/` ; les images d'origine restent inchangées.

**Attention :** le réglage couvre les images HTML existantes (hors logos) et les images de fond définies directement en HTML. Les images placées uniquement dans les feuilles CSS ou ajoutées ultérieurement par le générateur d'articles peuvent nécessiter une extension de ce système. Ne pas renommer les fichiers de page sans adapter le réglage.
