import socket
import sys
import json

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('192.168.40.52', 12345))  # Bind to the port your ESP32 is sending data to
    server_socket.listen(1)
    return server_socket

def main():
    try:
        server_socket = start_server()
        print("Server is running. Waiting for connections...")

        client_socket, client_address = server_socket.accept()
        print(f"Connected by {client_address}")

        while True:
            data = client_socket.recv(1024)
            if not data:
                print("No data received. Client may have disconnected.")
                break
            
            try:
                data_str = data.decode()
                if data_str.startswith("{") and data_str.endswith("\r"):
                    data = json.loads(data_str)
                    print(data)
            except json.JSONDecodeError:
                pass
    
    except KeyboardInterrupt:
        print("\nServer is shutting down.")
        if client_socket:
            client_socket.close()
        server_socket.close()
        sys.exit(0)

if __name__ == "__main__":
    main()
