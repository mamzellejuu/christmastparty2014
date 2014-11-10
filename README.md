#Application Frontend : 

##Application statique : 
* HTML : /public 
* CSS : /less
* JS Angular : /app
* JS Statique : /js/main.js
	- Faire la mise en place du JS autre que l'application Angular dans ce fichier ;
	- Fonts : /public/fonts
	- Images : /public/img

##Libraries javascript :

Pour ajouter une librairie javascript :

1. mettre le fichier sources dans le folder /js/libs ;
2. modifier le fichier gruntfile (tache contact) pour ajouter la dépendance ;
3. faire rouler la tache grunt dev pour rajouter la dépendance dans le package.

##Grunt Task : 
Pour travailler en statique : mettre en route la tache grunt dev ;<br />
Cf. gruntfile pour plus d'infos sur les taches

##Node Application : 
Pour lancer l'application depuis la racine du projet :

```
NODE_ENV=development node app.js
```
							
L'application roule sur le port 3001;

###Parse API informations
				
```
Parse APP Configs : {
	"name": "nurun-noel-2014",
	"Application-ID": "yzcJJ3ZKhLHW4qfWgbZroKcYWXXr7to8WiJxgime",
	"Client-Key": "U8lksMh9rjruRLscxqy5wJHHMcZMupI6IheL8DtE",
	"Javascript-Key": "FpsmDaTsC9xoXtNhKbxxqBsHcbaBbsOFgfAsE8nP",
	"REST-API-Key": "NG6jpw5FMa0FQTPjEyKblTJY9G8plQYbW3IOWFFa",
	"Master-Key": "SC0Hkr4IgRmcFP08jtdHLxmpF8fY4wtLK0OwpN4H"
}
```

```
Table medias : {
	"objectId": "auto-increment-value",
	"url": "string",
	"createdAt": "date",
	"ACL": "date"
}
```

####Socket IO : 

* http://socket.io/
* http://java.dzone.com/articles/getting-started-socketio-and

####Node JS Parse : 
* https://github.com/shiki/kaiseki