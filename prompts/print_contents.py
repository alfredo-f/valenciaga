import pathlib
import platform
import sys
from textwrap import dedent
from typing import List

try:
    pathlib.Path("a").is_relative_to("b")  # noqa
except AttributeError:
    sys_version_info = sys.version_info
    raise AttributeError(
        f"Python {sys_version_info.major}.{sys_version_info.minor}"
        f" does not support the pathlib.Path.is_relative_to method."
    )

root_project = r"C:\Users\a.fomitchenko\PycharmProjects\public_webpage_countdown"

root_paths = None
exclude_paths = None
exclude_subpaths = None
exclude_extensions = None
include_paths = None

# Redirect print to file
OUTPUT_PATH = pathlib.Path("output_data/prompt_compiled.md")
OUTPUT_PATH.parent.mkdir(exist_ok=True, parents=True)
OUTPUT_PATH.write_text("")
OUTPUT_PATH_FILE = OUTPUT_PATH.open("a", encoding="utf-8", newline='\n')


def _alert_windows(
    body: str = "Done",
    title: str = "Done",
    on_top_of_everything: bool = True,
):
    if platform.system() != "Windows":
        return

    try:
        import win32api
    except ImportError:
        print(
            "import win32api failed, if you want the notification on Windows"
            " pip install pywin32"
        )
        return

    args = []
    if on_top_of_everything:
        args = [0x00001000]

    win32api.MessageBox(
        0,
        body,
        title,
        *args,
    )


def write_to_output(text):
    OUTPUT_PATH_FILE.write(text)
    OUTPUT_PATH_FILE.write("\n")


def write_single_file(
    root: pathlib.Path,
    item: pathlib.Path,
):
    write_to_output("\n" * 4)
    relative_path = item.relative_to(root.parent)
    write_to_output(f"""<section_of_file>
## File content of the file '{relative_path}'""")
    write_to_output(item.read_text())
    write_to_output("")  # Adds a newline for better readability


def print_file_contents(
    path: pathlib.Path,
    root: pathlib.Path,
    exclude_paths: List[pathlib.Path],
):
    """
    Print file contents with relative paths, excluding specific folders.
    """
    # Get all items in the directory recursively, excluding __pycache__ folders and the specific folder
    items = [
        item
        for item in path.rglob("*")
        if (
            item.suffix not in exclude_extensions
            and all(
            subpath not in item.parts
            for subpath in exclude_subpaths
        )
            and not any(
            item.is_relative_to(exclude_path)
            for exclude_path in exclude_paths
        )
        )
    ]

    for item in items:
        if item.is_file() and item.suffix not in [".png", ".jpg", ".jpeg",
                                                  ".gif"]:
            write_single_file(
                root=root,
                item=item,
            )


def main(
    folder_project: str,
    exclude_extensions_additional: List[str] = None,
):
    global root_paths, exclude_paths, exclude_subpaths, exclude_extensions, include_paths

    root_paths = [
        pathlib.Path(
            rf"{root_project}\{folder_project}"),
    ]

    # Define the path to exclude
    exclude_paths = [
        pathlib.Path(
            rf"{root_project}\{folder_project}\data"
        )
    ]
    exclude_subpaths = [
        "__pycache__",
        "cache",
    ]
    exclude_extensions = [
        ".ps1",
        ".png",
        ".ico",
        ".webmanifest",
        ".jpg",
        ".jpeg",
    ]
    include_paths = [
        pathlib.Path(
            rf"{root_project}\index.html"
        )
    ]
    if exclude_extensions_additional:
        _alert_windows(f"Excluding additional extensions: {exclude_extensions_additional}")
        exclude_extensions.extend(exclude_extensions_additional)

    paths = root_paths + include_paths

    try:
        # Iterate over each root path and call the function
        for root_path in root_paths:
            assert root_path.exists(), root_path
            write_to_output(f"""<section_of_folder>
# Showing file contents for path: '{root_path}'""")
            print_file_contents(root_path, root_path, exclude_paths)

        for file_path in include_paths:
            assert file_path.is_file(), file_path
            write_single_file(
                root=file_path.parent,
                item=file_path,
            )

        write_to_output("\n" * 10)
        # - When the last question is displayed, the button "Next" should be replaced by a new button called "Review All"
        write_to_output(
            dedent(r"""
<section_of_your_task>
Make the entire thing centered horizontally
</section_of_your_task>
                """)
        )
    finally:
        OUTPUT_PATH_FILE.close()
    # Convert OUTPUT_PATH_FILE to absolute path
    print(f"Wrote to {OUTPUT_PATH.resolve()}")


if __name__ == '__main__':
    folder_project = "app"
    main(
        folder_project=folder_project,
        exclude_extensions_additional=[
            # ".css",
            # ".js",
            # ".html",
        ]
    )
