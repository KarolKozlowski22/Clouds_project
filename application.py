from flask import Flask, jsonify, render_template
from neo4j import GraphDatabase

URI="neo4j+s://65795ea6.databases.neo4j.io"
USER="neo4j"
PASSWORD="tS5mC9iCCTOiWgDjxWblkz50rNNKgL4Dbkl48UTyoUw"

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

def close_driver():
    driver.close() 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users', methods=['GET'])
def get_users():
    query = "MATCH (u:netflix_user) RETURN u.Name AS name, u.Surname AS surname, u.Age AS age"
    with driver.session() as session:
        results = session.run(query)
        users = [{"name": record["name"], "surname": record["surname"], "age": record["age"]} for record in results]
    return jsonify(users)

@app.route('/movies', methods=['GET'])
def get_movies():
    query = "MATCH (m:movie) RETURN m.title AS title, m.genre AS genre, m.year AS year, m.director AS director"
    with driver.session() as session:
        results = session.run(query)
        movies = [{"title": record["title"], "genre": record["genre"], "year": record["year"].strftime("%Y-%m-%d") if record["year"] else None, "director": record["director"]} for record in results]
    return jsonify(movies)

@app.route('/watched/<name>/<surname>', methods=['GET'])
def get_watched_movies(name, surname):
    query = """
    MATCH (u:netflix_user {Name: $name, Surname: $surname})-[:Watched]->(m:movie)
    RETURN m.title AS title, m.genre AS genre, m.year AS year, m.director AS director
    """
    with driver.session() as session:
        results = session.run(query, name=name, surname=surname)
        movies = [
            {
                "title": record["title"],
                "genre": record["genre"],
                "year": record["year"].strftime("%Y-%m-%d") if record["year"] else None,
                "director": record["director"]
            }
            for record in results
        ]
    return jsonify(movies)

@app.route('/liked/<name>/<surname>', methods=['GET'])
def get_liked_movies(name, surname):
    query = """
    MATCH (u:netflix_user {Name: $name, Surname: $surname})-[:Liked]->(m:movie)
    RETURN m.title AS title, m.genre AS genre, m.year AS year, m.director AS director
    """
    with driver.session() as session:
        results = session.run(query, name=name, surname=surname)
        movies = [
            {
                "title": record["title"],
                "genre": record["genre"],
                "year": record["year"].strftime("%Y-%m-%d") if record["year"] else None,
                "director": record["director"]
            }
            for record in results
        ]
    return jsonify(movies)

@app.route('/recommendations/<name>/<surname>', methods=['GET'])
def get_recommendations(name, surname):
    query = """
    MATCH (u:netflix_user {Name: $name, Surname: $surname})-[:Watched]->(m:movie)-[:Similar]->(recommended:movie)
    WHERE NOT (u)-[:Watched]->(recommended)
    RETURN DISTINCT recommended.title AS title, recommended.genre AS genre, recommended.year AS year, recommended.director AS director
    """
    with driver.session() as session:
        results = session.run(query, name=name, surname=surname)
        recommendations = [
            {
                "title": record["title"],
                "genre": record["genre"],
                "year": record["year"].strftime("%Y-%m-%d") if record["year"] else None,
                "director": record["director"]
            }
            for record in results
        ]
    return jsonify(recommendations)

@app.route('/watched-by/<title>', methods=['GET'])
def get_users_who_watched(title):
    query = """
    MATCH (u:netflix_user)-[:Watched]->(m:movie {title: $title})
    RETURN u.Name AS name, u.Surname AS surname, u.Age AS age
    """
    with driver.session() as session:
        results = session.run(query, title=title)
        users = [
            {
                "name": record["name"],
                "surname": record["surname"],
                "age": record["age"]
            }
            for record in results
        ]
    return jsonify(users)

@app.route('/most-watched', methods=['GET'])
def get_most_watched_movies():
    query = """
    MATCH (u:netflix_user)-[:Watched]->(m:movie)
    RETURN m.title AS title, m.genre AS genre, m.year AS year, m.director AS director, COUNT(u) AS watch_count
    ORDER BY watch_count DESC
    LIMIT 5
    """
    with driver.session() as session:
        results = session.run(query)
        movies = [
            {
                "title": record["title"],
                "genre": record["genre"],
                "year": record["year"].strftime("%Y-%m-%d") if record["year"] else None,
                "director": record["director"],
                "watch_count": record["watch_count"]
            }
            for record in results
        ]
    return jsonify(movies)






if __name__ == '__main__':
    app.run(debug=True)
