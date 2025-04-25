#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define TRIG_PIN 13
#define ECHO_PIN 12

#define GREEN_LED 27
#define YELLOW_LED 26
#define RED_LED 25

const float BIN_DEPTH_CM = 30.0;

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* serverName = "http://YOUR_BACKEND_IP:8000/bin-data/esp32-data/";

long duration;
float distance;
float fillPercent;

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to Wi-Fi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void sendDataToBackend(float distance, float fillPercent) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["distance"] = distance;
    doc["fillPercent"] = fillPercent;
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    int httpResponseCode = http.POST(jsonBuffer);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  else {
    Serial.println("Wi-Fi Disconnected");
  }
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;

  if (distance > BIN_DEPTH_CM) distance = BIN_DEPTH_CM;

  fillPercent = (1 - distance / BIN_DEPTH_CM) * 100;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm | Fill: ");
  Serial.print(fillPercent);
  Serial.println(" %");

  if (fillPercent >= 80) {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(GREEN_LED, LOW);
  }
  else if (fillPercent >= 40) {
    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  }
  else {
    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
  }

  sendDataToBackend(distance, fillPercent);

  delay(5000);
}