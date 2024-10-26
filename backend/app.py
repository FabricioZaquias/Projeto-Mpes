from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

client = MongoClient('mongodb://mongo:27017/')
db = client.ongdb  # Conecta ao banco de dados chamado "ongdb"

# Rota para listar todos os projetos
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = list(db.projects.find({}))  # Recupera todos os projetos do MongoDB
    for project in projects:
        project['_id'] = str(project['_id'])  # Converte ObjectId para string
    return jsonify(projects), 200

# Rota para adicionar um novo projeto
@app.route('/projects', methods=['POST'])
def add_project():
    new_project = request.get_json()
    result = db.projects.insert_one(new_project)  # Insere o novo projeto no MongoDB
    return jsonify(str(result.inserted_id)), 201

# Rota para visualizar detalhes de um projeto específico
@app.route('/projects/<project_id>', methods=['GET'])
def get_project_details(project_id):
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if project:
        project['_id'] = str(project['_id'])
        return jsonify(project), 200
    return jsonify({"error": "Projeto não encontrado"}), 404

# Rota para remover um projeto do MongoDB
@app.route('/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    result = db.projects.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Projeto deletado com sucesso"}), 200
    return jsonify({"error": "Projeto não encontrado"}), 404

# Rota para atualizar um projeto
@app.route('/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    updated_data = request.get_json()
    result = db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Projeto atualizado com sucesso"}), 200
    return jsonify({"error": "Projeto não encontrado"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
