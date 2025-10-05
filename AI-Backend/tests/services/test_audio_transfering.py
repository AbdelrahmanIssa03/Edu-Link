from app.gRPC import service_pb2
import sys
import os
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def send_audio(stub, class_name: str, audio_path: str):
    with open(audio_path, "rb") as audio_file:
        audio_bytes = audio_file.read()

    request = service_pb2.SendAudioRequest(
        audioData=audio_bytes,
        className=class_name,
    )
    response = stub.SendAudio(request, timeout=3000)
    print("✅ Audio sent successfully.")
    return response


def send_lecture(stub, class_name: str, lecture_path: str):
    files = os.listdir(f"app/assets/wav/{lecture_path}")
    response = []

    start_lecture = time.time()
    print(f"Starting lecture...\n\n")

    for file_index in range(0, len(files)):
        start = time.time()
        print(f"Total Time taken for lecture: {(time.time() - start_lecture):.2f} seconds")
        print(f"Sending chunk_{file_index}...")

        response.append(
            send_audio(
                stub=stub,
                class_name=class_name,
                audio_path=f"app/assets/wav/{lecture_path}/chunk_{file_index}.wav",
            )
        )
        print(f"✅ chunk_{file_index} sent successfully.")
        end = time.time()

        elapsed = end - start
        break_time = max(30, 120 - elapsed)
        print(f"Time taken: {elapsed:.2f} seconds")

        print(f"Waiting for {break_time} seconds before sending the next chunk...\n\n")
        time.sleep(break_time)

    end_lecture = time.time()
    elapsed_lecture = end_lecture - start_lecture
    print(f"Ending lecture...")
    print(f"Total time taken for lecture: {elapsed_lecture:.2f} seconds")
    return response
