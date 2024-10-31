# Edit Dotfiles

A Raycast extension to manage and edit your configuration files efficiently using Neovim or your terminal of choice. This extension allows you to add, edit, and remove configuration files with ease.

## Features

-   Open configuration files in your default terminal.
-   Add new configuration files with customizable icons.
-   Edit existing configuration files.
-   Remove configuration files.
-   Export and import configuration settings.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dotfiles-editor-raycast-extension.git
   ```

2. Navigate to the extension directory:
   ```bash
   cd dotfiles-editor-raycast-extension
   ```

3. Install dependencies:
   ```bash
   npm install & npm run div
   ```

4. Link the extension with Raycast:
   Follow Raycast's [developer documentation](https://developers.raycast.com/) to link the extension with Raycast.

## Usage

-   **Open File**: Select a file from the list to open it in your default terminal.
-   **Add New File**: Use the "Add New File" option to add a configuration file. You can specify the file path and choose an icon.
-   **Edit File**: Select a file and choose "Edit File" to modify its details.
-   **Remove File**: Select a file and choose "Remove File" to delete it from the list.
-   **Export/Import**: Use the export/import options to save or load your configuration settings.

## Configuration

-   **File Path**: Enter the full path to your configuration file. The path will be normalized and stored.
-   **Icon Selection**: Choose an icon from the dropdown to visually identify your configuration file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
5. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
