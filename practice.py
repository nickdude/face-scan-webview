# import sys

# def main():
#     if len(sys.argv) < 2:
#         print("Usage: practice.py <filename>")
#         sys.exit(1)

#     filename = sys.argv[1]

#     try:
#         with open(filename, 'r') as file:
#             lines = file.readlines()
#             # Process the lines as needed

#         print("{'hr': 89, 'ibi': 576.9, 'sdnn': 177.1, 'rmssd': 197.0, 'pnn20': 77.8, 'pnn50': 66.7, 'hrv': 0.898536453124748, 'rr': 16.0, 'sysbp': 120, 'diabp': 71, 'vo2max' : 32.9, 'si': 1384.4, 'mhr': 193, 'hrr': 103, 'thr': 110, 'co': 8.8, 'map': 87.8, 'hu': 46.6, 'bv': '4756.5415712', 'tbw': 42.867239999999995, 'bwp': 60.4, 'bmi': 24.0, 'bf': 30. 6, 'asth_risk': 42.0}")  # Print success message to stdout

#     except FileNotFoundError:
#         print("File {} not found.".format(filename))
#     except Exception as e:
#         print("Error reading file {}: {}".format(filename, e))

# if __name__ == "__main__":
#     main()


import sys
import time

def main():
    if len(sys.argv) < 2:
        print("Usage: practice.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]

    try:
        with open(filename, 'r') as file:
            lines = file.readlines()
            # Process the lines as needed

        time.sleep(10)  # Wait for 10 seconds

        print("{'hr': 89, 'ibi': 576.9, 'sdnn': 177.1, 'rmssd': 197.0, 'pnn20': 77.8, 'pnn50': 66.7, 'hrv': 0.898536453124748, 'rr': 16.0, 'sysbp': 120, 'diabp': 71, 'vo2max' : 32.9, 'si': 1384.4, 'mhr': 193, 'hrr': 103, 'thr': 110, 'co': 8.8, 'map': 87.8, 'hu': 46.6, 'bv': '4756.5415712', 'tbw': 42.867239999999995, 'bwp': 60.4, 'bmi': 24.0, 'bf': 30. 6, 'asth_risk': 42.0}")  # Print success message to stdout

    except FileNotFoundError:
        print("File {} not found.".format(filename))
    except Exception as e:
        print("Error reading file {}: {}".format(filename, e))

if __name__ == "__main__":
    main()

