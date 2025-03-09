document.addEventListener("DOMContentLoaded", async () => {
    const fileListElem = document.getElementById("file-list");

    try {
        const response = await fetch("files.json");
        if (!response.ok) throw new Error(`HTTP 错误！状态码: ${response.status}`);

        const files = await response.json();
        const sortedFiles = sortFiles(files); // 排序文件和文件夹
        fileListElem.innerHTML = generateFileList(sortedFiles, "");
        addFolderToggleEvent();
    } catch (error) {
        fileListElem.innerHTML = "<li class='text-red-500'>⚠️ 文件列表加载失败</li>";
        console.error("❌ 文件列表加载错误:", error);
    }
});

// **排序函数**：文件夹在上，按名称升序排列
function sortFiles(files) {
    return files.sort((a, b) => {
        const isAFolder = typeof a === "object";
        const isBFolder = typeof b === "object";

        if (isAFolder && !isBFolder) return -1; // 文件夹优先
        if (!isAFolder && isBFolder) return 1;  // 文件在后

        // 获取名称（对象文件夹的 key 是它的名称）
        const nameA = isAFolder ? Object.keys(a)[0] : a;
        const nameB = isBFolder ? Object.keys(b)[0] : b;

        return nameA.localeCompare(nameB, "zh-CN", { numeric: true }); // 按 Windows 方式排序
    });
}

// **生成文件列表的 HTML**
function generateFileList(files, path) {
    let html = "";
    files.forEach(file => {
        if (typeof file === "string") {
            const filePath = encodeURI(`files/${path}${file}`);
            html += `<li class="p-2 bg-gray-100 rounded flex items-center">
                        📄 <a href="${filePath}" download class="ml-2 text-blue-600 hover:underline">${file}</a>
                    </li>`;
        } else if (typeof file === "object") {
            const folderName = Object.keys(file)[0];
            const sortedSubFiles = sortFiles(file[folderName]); // 递归排序子文件夹
            html += `<li class="folder bg-gray-200 p-2 rounded cursor-pointer">
                        📁 <span class="font-bold">${folderName}</span>
                        <ul class="pl-4">${generateFileList(sortedSubFiles, `${path}${folderName}/`)}</ul>
                    </li>`;
        }
    });
    return html;
}

// **点击文件夹可展开/折叠**
function addFolderToggleEvent() {
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", function (e) {
            e.stopPropagation(); // 阻止事件冒泡
            this.classList.toggle("open");
        });
    });
}
