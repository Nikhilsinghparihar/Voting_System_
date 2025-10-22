# Required libraries
import datetime
import socketio


sio = socketio.Client()
sio.connect("http://localhost:3100")


# Example input (replace with your data source)
scheduled_arrivals = [
        {'stop_id': 101, 'time': '08:30', 'bus_id': 'A1'},
        {'stop_id': 102, 'time': '08:40', 'bus_id': 'A1'},
]



actual_gps_logs = [
        {'bus_id': 'A1', 'stop_id': 101, 'timestamp': '08:32'},
        # Suppose A1 never logs arrival at stop 102
]



# Function to detect ghost buses
def ghost_bus_detector(scheduled, gps_logs, tolerance_minutes=5):
        ghost_buses = []
        for event in scheduled:
        # Check if there is an actual GPS log within tolerance window
                match_found = False
        for log in gps_logs:
                if log['bus_id'] == event['bus_id'] and log['stop_id'] == event['stop_id']:
                # Check time difference
                        sched_time = datetime.datetime.strptime(event['time'], '%H:%M')
                log_time = datetime.datetime.strptime(log['timestamp'], '%H:%M')
                if abs((sched_time - log_time).total_seconds()) / 60 <= tolerance_minutes:
                        match_found = True
                        break
        if not match_found:
                ghost_buses.append(event)
        return ghost_buses
sio.disconnect()

print("Ghost buses detected:")
