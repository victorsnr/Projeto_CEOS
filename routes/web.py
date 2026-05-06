from flask import Blueprint, render_template
from models import Apostador, Aposta
from datetime import datetime

web = Blueprint('web', __name__)

@web.route('/')
def home():
    return render_template('home.html')

@web.route('/exibir_apostadores')
def apostadores():
    apostadores = Apostador.query.all()
    return render_template('exibir_apostadores.html', apostadores=apostadores)

@web.route('/editar_cadastro/<int:apostador_id>')
def atualizar_apostador(apostador_id):
    return render_template('atualizar_apostador.html', apostador_id=apostador_id)

@web.route('/deletar_apostador')
def deletar_apostador():
    return render_template('deletar_apostador.html')

#@web.route('/exibir_apostas/<int:apostador_id>')
#def apostas(apostador_id):
#    return render_template('apostas.html', apostador_id=apostador_id)

@web.route('/apostar')
def realizar_aposta():
    return render_template('apostar.html')