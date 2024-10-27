# ESP8266 环境数据监控系统

这是一个使用 ESP8266 和 Flask 构建的环境数据监控系统。ESP8266 通过 DHT22 传感器采集环境数据（温度和湿度），并将数据发送到 Flask 服务器。Flask 服务器将数据存储在 MySQL 数据库中，并提供 API 接口供前端调用。

## 功能

- 实时采集环境数据（温度和湿度）。
- 将数据存储在 MySQL 数据库中。
- 提供 API 接口获取最新的环境数据、平均数据等。
- 提供简单的 Web 界面展示数据。
  
## 目录结构

```
/esp8266
    esp8266_code.ino
/static
    /css
        styles.css
    /js
        scripts.js
    /templates
        index.html
app.py
README.md
LICENSE
```

## 安装与配置

### 1. 安装依赖

#### ESP8266

1. 安装 [Arduino IDE](https://www.arduino.cc/en/software)。
2. 安装 ESP8266 支持库：
   - 打开 Arduino IDE，进入 `文件` -> `首选项`。
   - 在 `附加开发板管理器网址` 中添加 `http://arduino.esp8266.com/stable/package_esp8266com_index.json`。
   - 进入 `工具` -> `开发板` -> `开发板管理器`，搜索并安装 `esp8266`。
3. 安装 DHT 库：
   - 进入 `工具` -> `管理库`，搜索并安装 `DHT sensor library`。

#### Flask 服务器

1. 安装 Python 3.x。
2. 安装 Flask 和 MySQL Connector：
   ```bash
   pip install Flask mysql-connector-python
   ```

### 2. 配置 ESP8266

1. 打开 `esp8266/esp8266_code.ino`。
2. 修改 `ssid` 和 `password` 为你的 WiFi 网络信息。
3. 修改 `SERVER_IP` 为你的 Flask 服务器的 IP 地址。

### 3. 配置 Flask 服务器

1. 打开 `app.py`。
2. 修改 `db_config` 中的数据库连接信息。

### 4. 运行项目

#### 运行 ESP8266

1. 将 `esp8266_code.ino` 上传到 ESP8266。
2. 打开串口监视器，查看数据上传情况。

#### 运行 Flask 服务器

1. 运行 Flask 服务器：
   ```bash
   python app.py
   ```
2. 打开浏览器，访问 `http://localhost:5888` 查看数据。

## API 接口

- **添加环境数据**: `POST /environment/info/add`
- **获取最新环境数据**: `GET /environment/info/get`
- **获取平均环境数据**: `GET /environment/info/average`

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
