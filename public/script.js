document.addEventListener("DOMContentLoaded", async () => {
    const fileListElem = document.getElementById("file-list");

    try {
        const response = await fetch("files.json");
        if (!response.ok) throw new Error(`HTTP 错误！状态码: ${response.status}`);

        const files = await response.json();
        fileListElem.innerHTML = generateFileList(files, "");
        addFolderToggleEvent();
    } catch (error) {
        fileListElem.innerHTML = "<li class='text-red-500'>⚠️ 文件列表加载失败</li>";
        console.error("❌ 文件列表加载错误:", error);
    }
});

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
            html += `<li class="folder bg-gray-200 p-2 rounded cursor-pointer">
                        📁 <span class="font-bold">${folderName}</span>
                        <ul class="pl-4">${generateFileList(file[folderName], `${path}${folderName}/`)}</ul>
                    </li>`;
        }
    });
    return html;
}

// 添加点击事件，使文件夹可展开/折叠
function addFolderToggleEvent() {
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", function (e) {
            e.stopPropagation(); // 阻止事件冒泡
            this.classList.toggle("open");
        });
    });
}
