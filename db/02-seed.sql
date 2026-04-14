INSERT INTO cocktails (nom, image, histoire, origine, ingredients, disponibilite, prix, categorie) VALUES
('Mojito','https://images.unsplash.com/photo-1551538827-9c037cb4f32a','Le Mojito est né à La Havane, Cuba.','Cuba','["Rhum blanc", "Citron vert", "Menthe fraîche", "Sucre de canne", "Eau gazeuse"]',true,9.50,'Classique'),
('Margarita','https://images.unsplash.com/photo-1556855810-ac404aa91e85','Créée dans les années 1930-1940 au Mexique.','Mexique','["Tequila", "Triple sec", "Jus de citron vert", "Sel"]',true,10.00,'Classique'),
('Cosmopolitan','https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b','Popularisé dans les années 1990.','États-Unis','["Vodka", "Cointreau", "Jus de cranberry", "Jus de citron vert"]',true,11.00,'Moderne'),
('Old Fashioned','https://images.unsplash.com/photo-1470337458703-46ad1756a187','Considéré comme le premier cocktail de l histoire.','États-Unis','["Bourbon", "Sucre", "Angostura bitters", "Zeste d orange"]',true,12.00,'Classique'),
('Pina Colada','https://images.unsplash.com/photo-1490750967868-88aa4f44baee','Inventée à Porto Rico dans les années 1950.','Porto Rico','["Rhum blanc", "Creme de coco", "Jus d ananas", "Glace pilée"]',true,10.50,'Tropical'),
('Negroni','https://images.unsplash.com/photo-1551751299-1b51cab2694c','Créé en 1919 à Florence.','Italie','["Gin", "Vermouth rouge", "Campari", "Zeste d orange"]',true,11.50,'Classique'),
('Daiquiri','https://images.unsplash.com/photo-1497534446932-c925d1a93f0a','Né à Cuba à la fin du XIXe siècle.','Cuba','["Rhum blanc", "Jus de citron vert", "Sirop de sucre"]',true,9.00,'Classique'),
('Manhattan','https://images.unsplash.com/photo-1575023782549-62ca0d244b39','Créé dans les années 1870 à New York.','États-Unis','["Whisky de seigle", "Vermouth rouge", "Angostura bitters", "Cerise au marasquin"]',true,12.50,'Classique'),
('Mai Tai','https://images.unsplash.com/photo-1536935338788-846bb9981813','Créé en 1944 par Victor Bergeron.','États-Unis','["Rhum ambré", "Rhum brun", "Curacao orange", "Sirop d orgeat", "Jus de citron vert"]',true,11.00,'Tropical'),
('Espresso Martini','https://images.unsplash.com/photo-1514432324607-a09d9b4aefda','Inventé par Dick Bradsell à Londres en 1983.','Royaume-Uni','["Vodka", "Liqueur de café", "Espresso", "Sirop de sucre"]',true,12.00,'Moderne')
ON CONFLICT DO NOTHING;
