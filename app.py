import lpldata
from flask import Flask, render_template

app = Flask(__name__, template_folder='./templates', static_folder='./static/')
LPL = lpldata.Lpl_Data()


@app.route('/')
def hello_world():
    # return render_template("index.html")
    return render_template('home.html')


@app.route('/test/<team_name>/', methods=['GET', 'POST'])
def test(team_name):
    return render_template('test.html', team_name=team_name)

@app.route('/team_data', methods=['GET', 'POST'])
def team_data():
    return LPL.get_team_data()


@app.route('/player/<player_name>/')
def player_page(player_name):
    # todo:创建players表，并从表中选手读取数据
    # player_data = LPL.get
    return render_template("player_page.html", player_data=player_name)

@app.route('/get_logo/<player_name>/', methods=['GET', 'POST'])
def get_logo(player_name):
    # todo:创建players表，并从表中选手读取数据
    # player_data = LPL.get
    return LPL.get_team_logo(player_name)

@app.route('/get_player_data/', methods=['GET', 'POST'])
def get_player_data():
    return LPL.get_player_info()


@app.route('/show_team_img/<team_name>/', methods=['GET', 'POST'])
def team_img(team_name):
    return LPL.get_team_info(team_name)


@app.route('/player_top', methods=['GET', 'POST'])
def memberdata():
    return LPL.get_player_top()


@app.route('/team_top', methods=['GET', 'POST'], endpoint='team_top_endpoint')
def memberdata():
    return LPL.get_team_top()


@app.route('/wingsvd', methods=['GET', 'POST'])
def wings_vd():
    return LPL.get_wings_vd()


@app.route('/wingstop5', methods=['GET', 'POST'])
def wings_top5():
    return LPL.get_wings_top5()


@app.route('/heropick', methods=['GET', 'POST'])
def hero_pick():
    return LPL.get_hero_top60()


@app.route('/homeround', methods=['GET', 'POST'])
def home_round():
    return LPL.get_home_data()


if __name__ == '__main__':
    app.run(debug=True)
