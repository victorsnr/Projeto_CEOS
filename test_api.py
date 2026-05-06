import pytest

from flask import Flask, make_response, jsonify, request
from routes.api import api
from routes.web import web
import config
from app import create_app
from extensions import db

def log(method, endpoint, status_code):
    print(f"{method} {endpoint} - Status Code: {status_code}")

@pytest.fixture
def client():
    app = create_app()

    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


    
def test_apostador(client):
    # Teste de cadastro de apostador (POST)
    response = client.post('/api/cadastrar_apostador', json={
        'nome': 'TESTE',
        'email': 'teste@exemplo.com',
        'telefone': '85999999999',
        'cpf': '12345678900',
        'dt_nasc': '2000-01-01'
    })
    log("POST", "/api/cadastrar_apostador", response.status_code)
    assert response.status_code == 201

    response = client.get('/api/obter_cadastro/1')
    assert response.status_code == 200
    log("GET", f'/api/obter_apostador/1', response.status_code)
    
    data = response.get_json()

    apostador_cpf = data['cpf']
    apostador_id = data['id']

    # Teste de aposta (POST)
    response = client.post('/api/apostar', json={
        'cpf': apostador_cpf,
        'tipo_aposta': 'tipo_teste',
        'valor': 100.0,
        'resultado': 'pendente'
    })
    log("POST", "/api/apostar", response.status_code)
    assert response.status_code == 201

    # Listagem de apostas (GET)
    response = client.get(f'/api/exibir_apostas/{apostador_id}')
    log("GET", f'/api/exibir_apostas/{apostador_id}', response.status_code)
    assert response.status_code == 200

    apostas = response.get_json()

    assert len(apostas) == 1
    assert apostas[0]['valor'] == 100.0

    # Teste de aposta 2 (POST)
    response = client.post('/api/apostar', json={
        'cpf': apostador_cpf,
        'tipo_aposta': 'tipo_teste_2',
        'valor': 200.0,
        'resultado': 'pendente'
    })
    log("POST", "/api/apostar", response.status_code)
    response = client.get(f'/api/exibir_apostas/{apostador_id}')
    assert response.status_code == 200

    apostas = response.get_json()

    assert len(apostas) == 2
    assert apostas[1]['valor'] == 200.0

    # Teste de edição de cadastro (PUT)
    response = client.put(f'/api/editar_cadastro/{apostador_id}', json={
        'nome': 'TESTE ATUALIZADO',
        'email': 'teste_atualizado@exemplo.com',
        'telefone': '85988888888'
    })
    log("PUT", f'/api/editar_cadastro/{apostador_id}', response.status_code)
    assert response.status_code == 200

    response = client.get(f'/api/exibir_apostadores')
    log("GET", f'/api/exibir_apostadores', response.status_code)
    assert response.status_code == 200

    # Teste de exclusão de cadastro (DELETE)
    response = client.delete(f'/api/deletar_cadastro/{apostador_id}')
    log("DELETE", f'/api/deletar_cadastro/{apostador_id}', response.status_code)
    assert response.status_code == 200

