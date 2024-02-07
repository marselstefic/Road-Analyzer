import socket
import sys
import matplotlib.pyplot as plt
from collections import deque
import json
import time

time_data = deque(maxlen=50)  # Store the last 50 timestamps
gyro_x_data = deque(maxlen=50)
gyro_y_data = deque(maxlen=50)
gyro_z_data = deque(maxlen=50)
acc_x_data = deque(maxlen=50)
acc_y_data = deque(maxlen=50)
acc_z_data = deque(maxlen=50)

# Create a figure and axis for plotting
plt.ion()  # Turn on interactive mode for real-time plotting
fig, ax = plt.subplots()
line_gx, = ax.plot([], label='Gyro X')
line_gy, = ax.plot([], label='Gyro Y')
line_gz, = ax.plot([], label='Gyro Z')
line_ax, = ax.plot([], label='Acc X')
line_ay, = ax.plot([], label='Acc Y')
line_az, = ax.plot([], label='Acc Z')
ax.set_xlabel('Time')
ax.set_ylabel('Value')
ax.set_title('Real-time Gyro Data')
ax.legend()
ax.set_ylim(-500, 500)

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('192.168.40.52', 12345))  # Bind to the port your ESP32 is sending data to
    server_socket.listen(1)
    return server_socket

def update_plot():
    line_gx.set_data(time_data, gyro_x_data)
    line_gy.set_data(time_data, gyro_y_data)
    line_gz.set_data(time_data, gyro_z_data)
    line_ax.set_data(time_data, acc_x_data)
    line_ay.set_data(time_data, acc_y_data)
    line_az.set_data(time_data, acc_z_data)
    ax.relim()
    ax.autoscale_view()
    plt.pause(0.01)  # Pause to allow the plot to update

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
                    print(data_str)
                    data = json.loads(data_str)
                    gyro_x = data.get('GX', 0.0)
                    gyro_y = data.get('GY', 0.0)
                    gyro_z = data.get('GZ', 0.0)
                    acc_x = data.get('AX', 0.0)
                    acc_y = data.get('AY', 0.0)
                    acc_z = data.get('AZ', 0.0)

                    # Use a timestamp or time-related value for the x-axis
                    timestamp = time.time()
                    time_data.append(timestamp)

                    gyro_x_data.append(gyro_x)
                    gyro_y_data.append(gyro_y)
                    gyro_z_data.append(gyro_z)
                    acc_x_data.append(acc_x)
                    acc_y_data.append(acc_y)
                    acc_z_data.append(acc_z)

                    # Update the plot with new data
                    update_plot()
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
