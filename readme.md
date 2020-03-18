# Projekt javascriptbaserad webbutveckling
### (Denna readme omfattar lösningen för webbtjänsten)

## Krav

- Uppgiften ska lösas med HTML, CSS och JavaScript (på både klient- och serversidan).

#### Webbsida
- Valfritt innehåll som använder en REST-webbtjänst som sin datakälla.

- Använd ett JavaScript-baserat ramverk (React, Angular/AngularJs eller Vue)

- *Tänk på: fokus på denna kurs är utveckling av klient- och serverutveckling med JavaScript. Lägg inte alltför stort fokus/tid på design av din webbplats, om du inte får tid över på slutet. Fokusera på kursens lärmoment för uppgiftens skull.*

#### Webbtjänst
- REST-webbtjänsten ska ha CRUD-funktionalitet och skapas med hjälp av Node.js, Express och MongoDB.

## Planerad lösning

- **Reddit-klon med följande funktioner**
 - Lägga in länk och kommentar om länken
 - Rösta upp eller ner länk
 - Kommentarer
 - Sortering
 - Kategorier
 - Kategorier skapade av användare


## API:et har följande funktionalitet och endpoints

##### Hämta alla inlägg
- (/posts) GET

##### Hämta enskilt inlägg
- (/posts/:postid) GET

##### Skapa inlägg
- (/posts) POST
- Json-exempel {"title" : "Exempeltitel", "url": "http://www.example.com", "category": "funniest", "description": "Denna länk är kul för att den..."}

##### Uppdatera inlägg
- (/posts/:postid) PUT  
- Json, samma som ovan.


##### Radera inlägg
- (/posts/:postid) DELETE

##### Kommentera inlägg
- (/posts/:postid/comment) POST
- Json-exempel {"content" : "Kommentarstext här"}

##### Ändra kommentar
- (/posts/:postid/comment/:commentid) PUT
- Json, samma som ovan.

##### Radera kommentar
- (/posts/:postid/comment/:commentid) DELETE

##### Hämta alla kategorier
- (/category) GET

##### Skapa kategori
- (/category) POST
- Json-exempel: {"categoryName" : "funny"}

##### Ta bort kategori (ej färdig)
