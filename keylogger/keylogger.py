import requests
from pynput import keyboard, mouse

current_word = []

def send_to_server(word):
    try:
        requests.post("http://localhost:5000/event", json={"word": word})
    except Exception as e:
        print("Error sending word:", e)

def on_press(key):
    global current_word
    try:
        if hasattr(key, 'char') and key.char is not None:
            current_word.append(key.char)
    except AttributeError:
        pass

    if key == keyboard.Key.space or key == keyboard.Key.enter:
        if current_word:
            word = ''.join(current_word)
            send_to_server(word)
            current_word = []

def on_click(x, y, button, pressed):
    global current_word
    if pressed and current_word:
        word = ''.join(current_word)
        send_to_server(word)
        current_word = []

if __name__ == "__main__":
    keyboard_listener = keyboard.Listener(on_press=on_press)
    mouse_listener = mouse.Listener(on_click=on_click)

    keyboard_listener.start()
    mouse_listener.start()

    keyboard_listener.join()
    mouse_listener.join()