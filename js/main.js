// main.js
import { handleMusicSearch } from './musicSearch.js';
// 导入其他模块...

document.addEventListener('DOMContentLoaded', () => {
    // 初始化音乐搜索功能
    handleMusicSearch();
    const buttons = document.querySelectorAll('.sidebar button');
    const contentSections = document.querySelectorAll('.content-section');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.id.replace('Btn', 'Content');
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');

            // 根据按钮 ID 调用相应的处理函数
            switch (button.id) {
                case 'musicSearchBtn':
                    handleMusicSearch();
                    break;
                // 其他 case...
            }
        });
    });
});