// musicSearch.js
let searchInput, searchButton, resultArea, audioPlayer, musicPlayer, songInfo;

export function handleMusicSearch() {
    // 获取DOM元素
    searchInput = document.getElementById('musicSearchInput');
    searchButton = document.getElementById('searchMusicBtn');
    resultArea = document.getElementById('musicResults');
    audioPlayer = document.getElementById('audioPlayer');
    musicPlayer = document.getElementById('musicPlayer');
    songInfo = document.getElementById('songInfo');

    // 添加事件监听器
    searchButton.addEventListener('click', searchMusic);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchMusic();
        }
    });

    // 音频播放结束时的处理
    audioPlayer.addEventListener('ended', onPlaybackEnded);
}

function searchMusic() {
    const keyword = searchInput.value.trim();
    if (!keyword) {
        resultArea.innerHTML = "请输入搜索关键词";
        return;
    }
    resultArea.innerHTML = "搜索中...";
    const searchUrl = `/.netlify/functions/proxy?keyword=${encodeURIComponent(keyword)}`;
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            if (data.songs && Array.isArray(data.songs)) {
                displaySearchResults(data.songs);
            } else {
                resultArea.innerHTML = "未找到相关歌曲";
            }
        })
        .catch(error => {
            console.error('搜索错误:', error);
            resultArea.innerHTML = "搜索出错，请稍后再试。";
        });
}

function displaySearchResults(songs) {
    if (songs.length === 0) {
        resultArea.innerHTML = "未找到相关歌曲";
        return;
    }
    let html = '<ul>';
    songs.forEach((song, index) => {
        html += `<li><button onclick="playSong('${encodeURIComponent(song)}', ${index + 1})">${song}</button></li>`;
    });
    html += '</ul>';
    resultArea.innerHTML = html;
}
function getSong(songName, n) {
    resultArea.innerHTML = "加载中...";
    const url = `http://lpz.chatc.vip/apiqq.php?msg=${songName}&n=${n}&type=json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('歌曲数据:', data);
            if (data.code === 200 && data.data) {
                playSong(data.data);
            } else {
                throw new Error(data.msg || '获取歌曲信息失败');
            }
        })
        .catch(error => {
            console.error('获取歌曲信息错误:', error);
            resultArea.innerHTML = "无法获取歌曲信息：" + error.message + "。请尝试其他歌曲。";
        });
}

function playSong(songName, index) {
    console.log(`Playing song: ${decodeURIComponent(songName)}, index: ${index}`);
    // 这里添加播放歌曲的逻辑
    // 例如，可以发送请求到另一个API来获取歌曲的URL
    fetch(`/.netlify/functions/proxy?keyword=${songName}&n=${index}`)
        .then(response => response.json())
        .then(data => {
            if (data.music_url) {
                // 假设您的HTML中有一个audio元素
                const audioPlayer = document.getElementById('audioPlayer');
                audioPlayer.src = data.music_url;
                audioPlayer.play();
                // 更新UI以显示正在播放的歌曲信息
                document.getElementById('nowPlaying').textContent = `正在播放: ${decodeURIComponent(songName)}`;
            } else {
                console.error('No music URL found in the response');
                alert('无法播放该歌曲，请尝试其他歌曲。');
            }
        })
        .catch(error => {
            console.error('Error playing song:', error);
            alert('播放出错，请稍后再试。');
        });
}

function updateSongInfo(songData) {
    let infoHtml = `
        <h2>正在播放: ${songData.song_name}</h2>
        <p>歌手: ${songData.song_singer}</p>
        <p>音质: ${songData.quality || '未知'}</p>
    `;
    if (songData.cover) {
        infoHtml += `<img src="${songData.cover}" alt="专辑封面" style="max-width: 200px;">`;
    }
    songInfo.innerHTML = infoHtml;
    if (songData.lyric) {
        resultArea.innerHTML = `<pre>${songData.lyric}</pre>`;
    } else {
        resultArea.innerHTML = "暂无歌词";
    }
}

function onPlaybackEnded() {
    resultArea.innerHTML = "播放结束，请选择新的歌曲。";
}

// 使 getSong 函数在全局范围内可用
window.getSong = getSong;
window.playSong = playSong;