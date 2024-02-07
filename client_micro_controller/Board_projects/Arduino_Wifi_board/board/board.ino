#include <WiFi.h>
#include <HardwareSerial.h>

HardwareSerial SerialPort(2);

const char* ssid = "~";     // Replace with your WiFi network name
const char* password = "88888888";  // Replace with your WiFi password

const char* host = "192.168.40.52"; // Replace with the IP address of your PC
const uint16_t port = 12345;      // Port to send message to

void setup() {
  SerialPort.begin(38400, SERIAL_8N1, 21, 22);
  Serial.begin(9600);
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Connect to PC server
  WiFiClient client;
  if (!client.connect(host, port)) {
    Serial.println("Connection to host failed");
    delay(1000);
    return;
  }

  // Continuously send sensor data
  while(client.connected()) {
    String buffer = "";
      while (SerialPort.available()) {
        char c = SerialPort.read();
        buffer += c;
        if (c == '\r') {
          break; // End of one JSON string
        }
      }
      if (buffer.length() > 0) {
        client.print(buffer);
        Serial.println("Sensor data sent");
      }
      delay(100); // Delay between reads
    }

  // If disconnected, try to reconnect
  if (!client.connected()) {
    client.stop();
    Serial.println("Disconnected from server. Attempting to reconnect...");
    delay(5000); // Wait before attempting to reconnect
  }
}