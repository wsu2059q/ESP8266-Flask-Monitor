from flask import Flask, request, jsonify, render_template
import mysql.connector
from datetime import datetime, timedelta

app = Flask(__name__)

# 数据库配置
db_config = {
    'user': 'key',
    'password': 'key123456',
    'host': '192.168.100.110',
    'database': 'key'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/environment/info/add', methods=['POST'])
def add_environment_info():
    data = request.json  # 获取请求中的 JSON 数据
    environment_no = data.get('environmentNo', 'Unknown')  # 获取环境编号，默认为 'Unknown'
    humidity = data.get('humidity', 0.0)  # 获取湿度，默认为 0.0
    temperature = data.get('temperature', 0.0)  # 获取温度，默认为 0.0

    try:
        connection = get_db_connection()  # 获取数据库连接
        cursor = connection.cursor()  # 创建数据库游标
        query = "INSERT INTO environment_data (environment_no, humidity, temperature) VALUES (%s, %s, %s)"
        cursor.execute(query, (environment_no, humidity, temperature))  # 执行插入操作
        connection.commit()  # 提交事务
        cursor.close()  # 关闭游标
        connection.close()  # 关闭数据库连接
        return jsonify({"status": "success"}), 200  # 返回成功状态
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 返回错误信息

@app.route('/environment/info/get', methods=['GET'])
def get_environment_info():
    try:
        connection = get_db_connection()  # 获取数据库连接
        cursor = connection.cursor(dictionary=True)  # 创建字典类型的游标
        query = "SELECT * FROM environment_data ORDER BY timestamp DESC LIMIT 100"
        cursor.execute(query)  # 执行查询操作
        data = cursor.fetchall()  # 获取所有查询结果
        cursor.close()  # 关闭游标
        connection.close()  # 关闭数据库连接
        return jsonify(data), 200  # 返回查询结果
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 返回错误信息

@app.route('/environment/info/average', methods=['GET'])
def get_average_environment_info():
    try:
        connection = get_db_connection()  # 获取数据库连接
        cursor = connection.cursor(dictionary=True)  # 创建字典类型的游标
        
        # 查询每小时的平均值
        query_hourly = """
        SELECT DATE(timestamp) AS date, HOUR(timestamp) AS hour, AVG(humidity) AS avg_humidity, AVG(temperature) AS avg_temperature
        FROM environment_data
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        GROUP BY DATE(timestamp), HOUR(timestamp)
        ORDER BY DATE(timestamp), HOUR(timestamp)
        """
        cursor.execute(query_hourly)  # 执行查询操作
        hourly_data = cursor.fetchall()  # 获取所有查询结果
        
        # 查询每天的平均值
        query_daily = """
        SELECT DATE(timestamp) AS date, AVG(humidity) AS avg_humidity, AVG(temperature) AS avg_temperature
        FROM environment_data
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(timestamp)
        ORDER BY DATE(timestamp)
        """
        cursor.execute(query_daily)  # 执行查询操作
        daily_data = cursor.fetchall()  # 获取所有查询结果
        
        # 查询最近 6 小时的实时数据
        query_realtime = """
        SELECT * FROM environment_data
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 6 HOUR)
        ORDER BY timestamp
        """
        cursor.execute(query_realtime)  # 执行查询操作
        realtime_data = cursor.fetchall()  # 获取所有查询结果
        
        cursor.close()  # 关闭游标
        connection.close()  # 关闭数据库连接
        
        return jsonify({
            "hourly": hourly_data,  # 每小时的平均值
            "daily": daily_data,  # 每天的平均值
            "realtime": realtime_data  # 最近 6 小时的实时数据
        }), 200  # 返回查询结果
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 返回错误信息

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5888)
