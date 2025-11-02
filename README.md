# File Manager (Node.js, ESM)

A CLI file manager implemented with Node.js core APIs

## Install & Run

```bash
npm run start -- --username=YourName
```

On start:

```
Welcome to the File Manager, YourName!
You are currently in <home_dir>
```

Exit:

```
.exit  or  Ctrl+C  →
Thank you for using File Manager, YourName, goodbye!
```

After every command:

```
You are currently in <cwd>
```

---

## Command Reference

### Navigation & Working Directory

- `up`  
  Go to parent directory (at root, CWD does not change).

- `cd path_to_directory`  
  Change directory (relative or absolute).

- `ls`  
  List current directory (folders first, then files; alphabetical; type shown).

### Basic File Operations

- `cat path_to_file`  
  Print file content (Readable stream).

- `add new_file_name`  
  Create empty file **in current directory** (name only, no path).

- `mkdir new_directory_name`  
  Create directory **in current directory** (name only, no path).

- `rn path_to_file new_filename`  
  Rename file in place (**new_filename is name only**, no path).

- `cp path_to_file path_to_new_directory`  
  Copy file to destination directory (Readable + Writable streams; no overwrite).

- `mv path_to_file path_to_new_directory`  
  Move file (stream copy + delete; no overwrite).

- `rm path_to_file`  
  Delete file.

### OS Info

- `os --EOL` — print default system EOL (visible string).
- `os --cpus` — total count + model + clock (GHz) per CPU.
- `os --homedir` — home directory.
- `os --username` — system user name.
- `os --architecture` — Node.js binary architecture.

### Hash

- `hash path_to_file`  
  Print SHA-256 hash (via stream).

### Compression (Brotli)

- `compress path_to_file path_to_destination`

- `decompress path_to_file path_to_destination`
