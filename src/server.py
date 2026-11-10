import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class RentalRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".mjs": "text/javascript",
    }


def main():
    parser = argparse.ArgumentParser(description="Serve RENTSAFE locally.")
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()

    handler = partial(RentalRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Serving RENTSAFE on http://127.0.0.1:{args.port}/ (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping RENTSAFE server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
