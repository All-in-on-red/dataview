#!/usr/bin/env bash
# This script runs a single command in the nix-shell environment on WSL and then exits.
nix-shell shell.nix --run "py2wasm main.py"