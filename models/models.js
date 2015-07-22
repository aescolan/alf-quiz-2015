// Construye la DB y el modelo importándolo de quiz.js

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

// Configuración BBDD
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6] || null);
var user      = (url[2] || null);
var pwd       = (url[3] || null);
var protocol  = (url[1] || null);
var dialect   = (url[1] || null);
var port      = (url[5] || null);
var host      = (url[4] || null);
var storage    = process.env.DATABASE_STORAGE;

// Cargar Model ORM - sequelize.js
var Sequelize = require('sequelize');

// Usar BBDD SQLite
//var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
						{dialect: protocol,
						 protocol: protocol,
						 port: port,
						 host: host,
						 storage: storage,   // solo SQLite (.env)
						 omitNull: true      // solo Postgres
						}
					);

// Importar la definición de la tabla Quiz en quiz.js
//var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Relación entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la definición de la tabla Quiz y Comment
exports.Quiz = Quiz;    // exportar definicióin de tabla Quiz
exports.Comment = Comment;   // exportar definicióin de tabla Comment

// Crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
	// Success() - ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function (count) {
		if (count === 0) { // Si tabla vacía, se inicializa
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				indice: 'Otro'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				indice: 'Ciencia'
			})
		.success(function () { console.log('Base de datos inicializada'); });
		};
	});
});
