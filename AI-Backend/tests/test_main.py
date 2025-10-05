import argparse
from tests import send_lecture, send_question, upload_single_file,class_stub,session_stub

def main():
    parser = argparse.ArgumentParser(
        description="Test gRPC Client for sending audio, questions, or uploading files."
    )
    parser.add_argument(
        "--class_name", required=True, help="Class name to include in the request"
    )
    parser.add_argument(
        "--mode",
        choices=["audio", "question", "upload"],
        required=True,
        help="Operation mode: audio, question, or upload",
    )
    parser.add_argument("--file_path", help="Path to file (for audio/upload modes)")
    parser.add_argument("--question", help="Question text (for question mode)")

    args = parser.parse_args()

    if args.mode == "audio":
        if not args.file_path:
            raise ValueError("You must provide --file_path for audio mode.")
        send_lecture(
            stub=session_stub, class_name=args.class_name, lecture_path=args.file_path
        )

    elif args.mode == "question":
        if not args.question:
            raise ValueError("You must provide --question for question mode.")
        send_question(
            stub=session_stub, class_name=args.class_name, question=args.question
        )

    elif args.mode == "upload":
        if not args.file_path:
            raise ValueError("You must provide --file_path for upload mode.")
        upload_single_file(
            stub=class_stub, class_name=args.class_name, file_path=args.file_path
        )


if __name__ == "__main__":
    main()
