module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM bsg_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }
	
	function getAuthors(res, mysql, context, complete){
        mysql.pool.query("SELECT id, fname, lname, origin FROM author", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.authors  = results;
            complete();
        });
    }
	
	function getAwards(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM award", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.awards  = results;
            complete();
        });
    }
	
	function getGenre(res, mysql, context, complete){
        mysql.pool.query("SELECT id, type FROM genre", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.genre  = results;
            complete();
        });
    }
	function getBooks(res, mysql, context, complete){
        mysql.pool.query("SELECT b.id, b.title, a.fname, a.lname, b.year_published, g.type FROM book b INNER JOIN author a ON b.author_id = a.id INNER JOIN genre g ON b.genre_id = g.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.books = results;
            complete();
        });
    }
	
	function getbook(res, mysql, context, id, complete){
        var sql = "SELECT id, title, author_id, year_published, genre_id FROM book WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.book = results[0];
            complete();
        });
    }
	
	function getAuthor(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, origin FROM author WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.author = results[0];
            complete();
        });
    }
	
    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, homeworld, age FROM bsg_people WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/book', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletebook.js", "deleteauthor.js"];
        var mysql = req.app.get('mysql');
        getBooks(res, mysql, context, complete);
        getAuthors(res, mysql, context, complete);
		getGenre(res, mysql, context, complete);
		getAwards(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('people', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedauthor.js", "selectedgenre.js","updatebook.js"];
        var mysql = req.app.get('mysql');
        getbook(res, mysql, context, req.params.id, complete);
        getAuthors(res, mysql, context, complete);
		getGenre(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-book', context);
            }

        }
    });
	
	router.get('/updateAuthor/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateauthor.js"];
        var mysql = req.app.get('mysql');
        getAuthor(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-author', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/addbook', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO book (title, author_id, year_published, genre_id) VALUES (?,?,?,?)";
        var inserts = [req.body.title, req.body.author, req.body.year_published, req.body.type];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/books/book');
            }
        });
    });
	
   router.post('/addauthor', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO author (fname, lname, origin) VALUES (?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.origin];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/books/book');
            }
        });
    });
	
	router.post('/addaward', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO award (name) VALUES (?)";
        var inserts = [req.body.fname, req.body.lname, req.body.origin];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/books/book');
            }
        });
    });
	
	  router.post('/addgenre', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO genre (type) VALUES (?)";
        var inserts = [req.body.type];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/books/book');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE book SET title=?, author_id=?, year_published=?, genre_id=? WHERE id=?";
        var inserts = [req.body.title, req.body.author, req.body.year_published, req.body.type, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });
	
	router.put('/updateAuthor/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE author SET fname=?, lname=?, origin=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.origin, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM book WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
	
	 router.delete('/deleteAuthor/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM author WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();