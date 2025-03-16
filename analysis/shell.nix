let
    pkgs = import <nixpkgs> {config = {}; overlays=[];};
in
pkgs.mkShellNoCC{
  name = "py2wasm-shell";
  buildInputs = [
    pkgs.python311
    pkgs.python311Packages.virtualenv
  ];

  shellHook = ''
    echo shell started!
    # Create a virtual environment if it doesn't exist
    if [ ! -d .venv ]; then
      echo "Creating virtual environment..."
      python -m venv .venv
      .venv/bin/pip install --upgrade pip
      .venv/bin/pip install py2wasm
    fi
    echo "Activating virtual environment..."
    source .venv/bin/activate
    echo "py2wasm is installed and ready to use!"'';
}