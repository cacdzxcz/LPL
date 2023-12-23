# @BY     :Java_S
# @Time   :2020/8/4 15:41
# @Slogan :够坚定够努力大门自然会有人敲,别怕没人赏识就像三十岁的梵高

import pymysql
import json


class Lpl_Data:
    def __init__(self):
        self.db = pymysql.connect(host='localhost', user='root', password='sykdfss588', port=3306, db='lpl')
        self.cur = self.db.cursor()
        self.create_teamLink()
        self.create_playerInfo()

    def close(self):
        self.cur.close()
        self.db.close()

    def query(self, sql, *args):
        self.cur.execute(sql, args)
        res = self.cur.fetchall()
        # self.close()
        return res


    def create_teamLink(self):
        try:
            sql = ('CREATE TABLE IF NOT EXISTS teamlogolink '
                   '(id INT AUTO_INCREMENT PRIMARY KEY,'
                   'name VARCHAR(255) NOT NULL,'
                   'link VARCHAR(255) NOT NULL)')
            self.cur.execute(sql)
            self.db.commit()
            print('create table teamlogolink success')
        except Exception as e:
            print('create table teamlogolink failed')

    def create_playerInfo(self):
        try:
            sql = ('CREATE TABLE IF NOT EXISTS players '
                   '(id INT AUTO_INCREMENT PRIMARY KEY,'
                   'en_name VARCHAR(255) NOT NULL,'
                   'cn_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,'
                   'team VARCHAR(255) NOT NULL,'
                   'link VARCHAR(255) NOT NULL,'
                   'kills INT NOT NULL,'
                   'assists INT NOT NULL,'
                   'survives INT NOT NULL,'
                   'damage INT NOT NULL,'
                   'views INT NOT NULL,'
                   'economy INT NOT NULL)'
                   )
            self.cur.execute(sql)
            self.db.commit()
            print('create table players success')
        except Exception as e:
            print('create table players failed')
            raise

    def get_team_info(self, team_name):
        # todo：修改数据库
        sql = 'SELECT link FROM 战队数据 WHERE 战队名称 = %s'
        res = self.query(sql, (team_name,))
        logo_link = res[0][0]

        sql = 'SELECT en_name,link FROM players WHERE team = %s'
        infos = self.query(sql, (team_name,))
        en_name = [info[0] for info in infos]
        link = [info[1] for info in infos]
        infos_dict = {'en_name': en_name, 'link': link, 'logo_link': logo_link}
        print(infos_dict)
        return json.dumps(infos_dict)

    def get_player_info(self):
        sql = 'SELECT en_name,cn_name,link,kills,assists,survives,damage,views,economy FROM players'
        infos = self.query(sql)
        en_names = [info[0] for info in infos]
        cn_names = [info[1] for info in infos]
        links = [info[2] for info in infos]
        kills = [info[3] for info in infos]
        assists = [info[4] for info in infos]
        survives = [info[5] for info in infos]
        damages = [info[6] for info in infos]
        views = [info[7] for info in infos]
        economy = [info[8] for info in infos]
        infos_dict = {'en_name': en_names, 'cn_name': cn_names,
                      'link': links, 'kill': kills, 'assist': assists,
                      'survive': survives, 'damage': damages, 'views': views,
                      'economy': economy}
        return json.dumps(infos_dict)

    def get_wings_vd(self):
        sql = 'SELECT 战队名称,胜场次数,败场次数,胜率 FROM 战队胜负数据'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        victory = [info[1] for info in infos]
        defeat = [info[2] for info in infos]
        win_rate = [info[3][:2] for info in infos]

        infos_list = [('name', name), ('victory', victory), ('defeat', defeat), ('winRate', win_rate)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_member_top12(self):
        sql = 'SELECT 队员名称,出场次数,总击杀,总助攻,总死亡 FROM 个人mvp前十二'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        out_count = [info[1] for info in infos]
        kill_sum = [info[2] for info in infos]
        assist_sum = [info[3] for info in infos]
        die_sum = [info[4] for info in infos]

        infos_list = [('name', name), ('outcount', out_count), ('killsum', kill_sum), ('assistsum', assist_sum),
                      ('diesum', die_sum)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_wings_top5(self):
        sql_wings = 'SELECT 战队名称,出场次数,胜率 FROM 战队排行榜前五'
        sql_member = 'SELECT 队员名称,位置,总击杀 FROM 个人排行榜前五'
        infos_wings = self.query(sql_wings)
        infos_member = self.query(sql_member)
        name = [info[0] for info in infos_wings]
        out_count = [info[1] for info in infos_wings]
        win_rate = [info[2] for info in infos_wings]
        member_name = [info[0] for info in infos_member]
        member_post = [info[1] for info in infos_member]
        member_kill_sum = [info[2] for info in infos_member]
        infos_list = [('name', name), ('outcount', out_count), ('winRate', win_rate),
                      ('membername', member_name), ('memberpost', member_post), ('memberkillsum', member_kill_sum)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_hero_top60(self):
        sql = 'SELECT 英雄名称,出场次数,pick比率,胜率 FROM 英雄pick率前六十'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        out_count = [info[1] for info in infos]
        pick = [info[2] for info in infos]
        winrate = [info[3] for info in infos]
        infos_list = [('name', name), ('outcount', out_count), ('picknum', pick), ('winrate', winrate)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)
    def get_team_logo(self, player_name):
        sql = 'SELECT team FROM players WHERE en_name=%s'
        infos = self.query(sql, (player_name,))
        team_name = infos[0][0]
        sql = 'SELECT link FROM 战队数据 WHERE 战队名称=%s'
        infos = self.query(sql, (team_name,))
        link = infos[0][0]
        print(link)
        return json.dumps({'link': link})
    def get_home_data(self):
        sql = 'SELECT name,data1,data2 FROM 首页圆圈数据'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        data1 = [info[1] for info in infos]
        data2 = [info[2] for info in infos]
        infos_list = [('name', name), ('data1', data1), ('data2', data2)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_team_data(self):
        sql = 'SELECT 战队名称,击杀,插眼,排眼,金钱,小龙,大龙,战队描述 FROM 战队数据'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        data1 = [info[1] for info in infos]
        data2 = [info[2] for info in infos]
        data3 = [info[3] for info in infos]
        data4 = [info[4] for info in infos]
        data5 = [info[5] for info in infos]
        data6 = [info[6] for info in infos]
        data7 = [info[7] for info in infos]
        infos_list = [('name', name), ('data1', data1), ('data2', data2), ('data3', data3), ('data4', data4)
                      , ('data5', data5), ('data6', data6), ('data7', data7)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_player_top(self):
        sql = 'SELECT name,position,total_kills,kda FROM player_top'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        position = [info[1] for info in infos]
        total_kills = [info[2] for info in infos]
        kda = [info[3] for info in infos]
        infos_list = [('name', name), ('position', position), ('total_kills', total_kills), ('kda', kda)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

    def get_team_top(self):
        sql = 'SELECT name,out_num,win_rate,all_kill FROM team_top'
        infos = self.query(sql)
        name = [info[0] for info in infos]
        out_num = [info[1] for info in infos]
        win_rate = [info[2] for info in infos]
        all_kill = [info[3] for info in infos]
        infos_list = [('name', name), ('out_num', out_num), ('win_rate', win_rate), ('all_kill', all_kill)]
        infos_dict = {key: value for key, value in infos_list}
        return json.dumps(infos_dict)

# lpl = Lpl_Data()
# lpl.home_data()
