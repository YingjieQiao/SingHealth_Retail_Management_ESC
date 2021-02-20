from flask import Flask, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

app = Flask(__name__)
app.config.from_pyfile('config.cfg')

mail = Mail(app)

s = URLSafeTimedSerializer('Thisisasecret!')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return '<form action="/" method="POST"><input name="email"><input type="submit"></form>'

    email = request.form['email']
    token = s.dumps(email, salt='email-confirm')

    msg = Message('Confirm Email', sender='starboypp69@gmail.com', recipients=[email])

    link = url_for('confirm_email', token=token, _external=True)

    msg.body = 'Your link is {}'.format(link)

    with app.open_resource("picture.png") as fp:
        msg.attach("picture.png", "picture/png", fp.read())
    with app.open_resource("train.csv") as fp:
        msg.attach("train.csv", "train/csv", fp.read())


    mail.send(msg)

    # for bulk email

    # with mail.connect() as conn:
    # for user in users:
    #     message = '...'
    #     subject = "hello, %s" % user.name
    #     msg = Message(recipients=[user.email],
    #                   body=message,
    #                   subject=subject)

    #     conn.send(msg)

    return '<h1>The email you entered is {}. The token is {}</h1>'.format(email, token)

@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return '<h1>The token is expired!</h1>'
    return '<h1>The token works!</h1>'

if __name__ == '__main__':
    app.run(debug=True)