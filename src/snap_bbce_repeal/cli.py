"""CLI entry point for SNAP BBCE repeal data generation."""

import argparse

from .pipeline import generate_all_data


def main():
    parser = argparse.ArgumentParser(
        description="Generate SNAP BBCE repeal analysis data"
    )
    parser.add_argument(
        "command",
        choices=["generate"],
        help="Command to run",
    )
    parser.add_argument(
        "--output-dir",
        default="public/data",
        help="Output directory for CSV files",
    )
    args = parser.parse_args()

    if args.command == "generate":
        generate_all_data(output_dir=args.output_dir)
