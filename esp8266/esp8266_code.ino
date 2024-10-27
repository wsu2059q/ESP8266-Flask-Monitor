#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

DHT dht(D5, DHT22);     //设置Data引脚IO

#define SERVER_IP "http://127.0.0.1/environment/info/add" // 网络服务器地址
WiFiClient client;
HTTPClient httpClient;
const char *ssid = "ssid"; 
const char *password = "password"; 

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);     
  Serial.println('\n');                     
  Serial.print("Connected to ");Serial.println(WiFi.SSID());        // 连接的SSID
  Serial.print("IP address:\t");Serial.println(WiFi.localIP());     // ESP8266的IP地址
  
  httpClient.begin(client, SERVER_IP); // 配置HTTP请求地址
  
  dht.begin();  // 启动DHT22
}

void loop() {
  delay(1000);                                //延迟
  float HUM = dht.readHumidity();              //读取湿度
  float TEM = dht.readTemperature();            //读取温度
  Serial.print("Humidity:");
  Serial.print(HUM);   
  Serial.print("  Temperature:");
  Serial.print(TEM);            
  
  String requestBody = "{\"environmentNo\":\"Esp8266\",\"humidity\":";
  requestBody += String(HUM);
  requestBody += ",\"temperature\":";
  requestBody += String(TEM);
  requestBody += "}";
  Serial.print("requestBody:"); Serial.println(requestBody);
+
  Serial.print("[HTTP] start\n");
  httpClient.addHeader("Content-Type", "application/json");
  int httpCode = httpClient.POST(requestBody);
  Serial.print("[HTTP] start request\n");
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK) {
      const String& payload = httpClient.getString();
      Serial.println(payload);
    }
  } else {
    Serial.printf("[HTTP] Failed, error: %s\n", httpClient.errorToString(httpCode).c_str());
  }
}
