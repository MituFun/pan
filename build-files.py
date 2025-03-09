import os
import json

def list_files(startpath):
    file_tree = []
    for entry in os.scandir(startpath):
        if entry.is_dir():
            file_tree.append({entry.name: list_files(entry.path)})
        else:
            file_tree.append(entry.name)
    return file_tree

# 确保路径正确
root_dir = "files"  # 你可以改成 "./files" 或 "files" 试试
if not os.path.exists(root_dir):
    print(f"目录 '{root_dir}' 不存在，请检查路径！")
else:
    files_structure = list_files(root_dir)
    with open("files.json", "w", encoding="utf-8") as f:
        json.dump(files_structure, f, ensure_ascii=False, indent=4)
    print("✅ 文件列表已生成：files.json")
