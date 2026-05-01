from sqlite3 import IntegrityError

from flask import Blueprint, jsonify, request
from extensions import db
from models import Apostador, Aposta
from datetime import datetime, date

api = Blueprint('api', __name__)

@api.route('/exibir_apostadores', methods=['GET'])
def listar_apostadores():
    apostadores = Apostador.query.all()

    resultado = []
    for a in apostadores:
        resultado.append({
            'id': a.id,
            'nome': a.nome,
            'email': a.email,
            'telefone': a.telefone,
            'cpf': a.cpf,
            'dt_nasc': a.dt_nasc.isoformat()
        })

    return jsonify(resultado)

@api.route('/cadastrar_apostador', methods=['POST'])
def cadastrar_apostador():
    data = request.json
    cpf = data.get('cpf')
    telefone = data.get('telefone')
    telefone = ''.join(filter(str.isdigit, telefone))
    
    if not data.get('nome') or not cpf:
        return jsonify({'message': 'Dados obrigatórios faltando'}), 400

    if len(cpf) != 11 or not cpf.isdigit():
        return jsonify({'message': 'CPF inválido'}), 400

    if len(telefone) not in [10, 11]:
        return jsonify({'message': 'Telefone inválido'}), 400

    dt_nasc = datetime.strptime(data['dt_nasc'], '%Y-%m-%d').date()

    if dt_nasc > date.today():
        return jsonify({'message': 'Data inválida'}), 400

    apostador_existente = Apostador.query.filter_by(cpf=cpf).first()
    if apostador_existente:
        return jsonify({'message': 'CPF já cadastrado'}), 400


    novo_apostador = Apostador(nome=data['nome'], 
                               email=data['email'], 
                               telefone=data['telefone'],
                               cpf=data['cpf'],
                               dt_nasc=datetime.strptime(data['dt_nasc'], '%Y-%m-%d').date())
    
    try:
        db.session.add(novo_apostador)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'CPF já cadastrado'}), 400

    return jsonify({
        'message': 'Apostador cadastrado',
        'id': novo_apostador.id
    }), 201

@api.route('/editar_cadastro/<int:apostador_id>', methods=['PUT'])
def editar_cadastro(apostador_id):
    apostador = Apostador.query.get_or_404(apostador_id)
    data = request.json

    apostador.nome = data['nome']
    apostador.email = data['email']
    apostador.telefone = data['telefone']
    apostador.cpf = data['cpf']
    apostador.dt_nasc = data['dt_nasc']

    db.session.commit()
    return jsonify({'message': 'Apostador atualizado'})

@api.route('/deletar_apostador/<int:apostador_id>', methods=['DELETE'])
def deletar_apostador(apostador_id):
    apostador = Apostador.query.get_or_404(apostador_id)
    db.session.delete(apostador)
    db.session.commit()
    return jsonify({'message': 'Apostador deletado'})


@api.route('/exibir_apostas/<int:apostador_id>', methods=['GET'])
def listar_apostas(apostador_id):
    apostas = Aposta.query.filter_by(apostador_id=apostador_id).all()

    resultado = []
    for a in apostas:
        resultado.append({
            'id': a.id,
            'tipo_aposta': a.tipo_aposta,
            'valor': a.valor,
            'resultado': a.resultado
        })

    return jsonify(resultado)

@api.route('/apostar', methods=['POST'])
def realizar_aposta():
    data = request.json

    nova_aposta = Aposta(apostador_id=data['apostador_id'],
                         tipo_aposta=data['tipo_aposta'],
                         valor=data['valor'], 
                         resultado=data['resultado'])
    
    db.session.add(nova_aposta)
    db.session.commit()

    return jsonify({'message': 'Aposta realizada'})
