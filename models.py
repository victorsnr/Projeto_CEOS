from extensions import db

class Apostador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    telefone = db.Column(db.String(11), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    dt_nasc = db.Column(db.Date, nullable=False)

class Aposta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    apostador_id = db.Column(db.Integer, db.ForeignKey('apostador.id'), nullable=False)
    tipo_aposta = db.Column(db.String(50), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    resultado = db.Column(db.String(20), nullable=False)
    
    apostador = db.relationship('Apostador', backref=db.backref('apostas', lazy=True, cascade='all, delete-orphan'))
