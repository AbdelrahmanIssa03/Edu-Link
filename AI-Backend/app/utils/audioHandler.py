import os
import argparse
from pydub import AudioSegment
from pydub.utils import make_chunks
from moviepy import VideoFileClip
import os


def extract_audio(mp4_path):
    base_name = os.path.splitext(os.path.basename(mp4_path))[0]
    print(f"Extracting audio from {mp4_path}...\n{base_name}")
    video = VideoFileClip(mp4_path)

    output_path = f"app/assets/wav/{base_name}.wav"

    video.audio.write_audiofile(output_path)

    print(f"Audio extracted and saved as: {output_path}")


def create_audio_chunks(file_path: str, chunk_length_s: int):
    file = os.path.basename(file_path).split(".")
    file_name, file_extension = file[0], file[1]

    audio = AudioSegment.from_file(file_path, format=file_extension)
    chunks = make_chunks(audio, chunk_length_s * 1000)

    output_dir = f"app/assets/wav/{file_name}_{chunk_length_s}"
    os.makedirs(output_dir, exist_ok=True)

    chunk_paths = []
    for i, chunk in enumerate(chunks):
        chunk_path = f"{output_dir}/chunk_{i}.wav"
        chunk.export(chunk_path, format="wav")
        chunk_paths.append(chunk_path)

    print(f"Created {len(chunks)} chunks of {chunk_length_s} seconds each.")


def main():
    parser = argparse.ArgumentParser(
        description="Split an audio file into fixed-length chunks."
    )
    parser.add_argument(
        "--mode",
        type=str,
        choices=["extracting", "chunking"],
        required=True,
        help="Mode of operation: 'extracting' or 'chunking'",
    )
    parser.add_argument(
        "--file_path", required=True, help="Path to the input audio file"
    )
    parser.add_argument(
        "--chunk_length",
        type=int,
        default=60,
        help="Chunk length in seconds (default: 60)",
    )

    args = parser.parse_args()

    if args.mode == "chunking":
        create_audio_chunks(args.file_path, args.chunk_length)
    elif args.mode == "extracting":
        extract_audio(args.file_path)


if __name__ == "__main__":
    main()
