document.addEventListener("DOMContentLoaded", async () => {
    const fileListElem = document.getElementById("file-list");

    try {
        const response = await fetch("files.json");

        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码: ${response.status}`);
        }

        const files = await response.json();
        fileListElem.innerHTML = generateFileList(files, "");
    } catch (error) {
        fileListElem.innerHTML = "<li>⚠️ 文件列表加载失败，请检查 files.json 是否正确部署！</li>";
        console.error("❌ 文件列表加载错误:", error);
    }
});

function generateFileList(files, path) {
    let html = "";
    files.forEach(file => {
        if (typeof file === "string") {
            const filePath = encodeURI(`files/${path}${file}`);
            html += `<li><a href="${filePath}" download>${file}</a></li>`;
        } else if (typeof file === "object") {
            const folderName = Object.keys(file)[0];
            html += `<li><strong>${folderName}</strong><ul>${generateFileList(file[folderName], `${path}${folderName}/`)}</ul></li>`;
        }
    });
    return html;
}
