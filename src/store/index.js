import Vue from 'vue'
import Vuex from 'vuex'

import {
  PLAYER_MV,
  PLAYER_MUSIC,
  SEARCH_BOX,
  SEARCH_HISTORY
} from './mutation-types';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowPlayer: false,
    playingSongmid: '',
    songPlayed: false,
    isScrollEle: false,
    songPlayMode: 1, // 循环模式 ：1=单曲,2=顺序 ,3=随机,4=循环
    isShowPlaySongList: false,
    playingSongInfo: {},
    formattedSongInfo: {},
    isShowSearchBox: false,
    playingSongNowTime: 0,
    playingSongNowLyricLine: null,
    playSongList: [],
    playingMVInfo: {},
    searchHistory: []
  },
  mutations: {
    ['changeScroll'](state, val) {
      state.isScrollEle = val || false;
    },
    /**搜索栏显示状态切换 */
    [SEARCH_BOX.CHANGE_DISPLAY_STATUS](state, val) {
      state.isShowSearchBox = val || false;
    },
    /**更新MV信息 */
    [PLAYER_MV.DATA_UPDATE](state, obj) {
      state.playingMVInfo = obj || {};
    },
    /**更新音乐播放器显示状态 */
    [PLAYER_MUSIC.CHANGE_DISPLAY_STATUS](state, val) {
      state.isShowPlayer = val || false;
    },
    /**音乐暂停 */
    [PLAYER_MUSIC.PLAY_PAUSE](state) {
      state.songPlayed = false;
    },
    /**切换音乐播放暂停 */
    [PLAYER_MUSIC.PLAY_SWITCH](state, bool) {
      if (typeof bool === 'boolean') {
        state.songPlayed = bool;
        return;
      }
      state.songPlayed = !state.songPlayed;
    },
    [PLAYER_MUSIC.LYRIC_NOW_LINE_SET](state, text) {
      if (!text) return;
      state.playingSongNowLyricLine = text;
    },
    /**更新音乐mid */
    [PLAYER_MUSIC.PLAY_SONG_MID_UPDATE](state, mid) {
      state.playingSongmid = mid;
    },
    /**更新正在播放音乐信息 */
    [PLAYER_MUSIC.PLAY_SONG_INFO_UPDATE](state, data) {
      state.playingSongInfo = data;
    },
    /**更新正在播放音乐信息-格式化 */
    [PLAYER_MUSIC.PLAY_SONG_INFO_FORMATE](state, data) {
      if (!data) return;
      this.commit('incSongList', data);
      this.commit('updatePlayingSongmid', data.songMid || '');
      state.formattedSongInfo = data;
    },
    /**列表增加歌曲 */
    [PLAYER_MUSIC.SONG_LIST_INC](state, song) {
      if (!song) return;
      let nowList = state.playSongList;
      for (let s in nowList) {
        if (nowList[s].songMid === song.songMid) return;
      }
      state.playSongList.push(song);
    },
    [PLAYER_MUSIC.SONG_LIST_SWITCH](state, val) {
      state.isShowPlaySongList = val || false;
    },
    /**移除一首 */
    [PLAYER_MUSIC.SONG_LIST_REDUCE](state, idx) {
      if (state.playingSongmid === state.playSongList[idx].songMid) {
        this.commit('songPlayNext');
        state.playSongList.splice(idx, 1);
      } else {
        state.playSongList.splice(idx, 1);
      }

      if (state.playSongList.length === 0) {
        state.playingSongmid = '';
        state.songPlayed = false;
        state.formattedSongInfo = {};
        state.playingSongInfo = {};
        state.isShowPlayer = false;
      }

    },
    /**上一曲 */
    [PLAYER_MUSIC.PLAY_PREV](state) {
      let nowSong = state.playingSongmid;
      let songList = state.playSongList;
      for (let s in state.playSongList) {
        s = parseInt(s);
        if (songList[s].songMid === nowSong) {
          if (s === 0) {
            return;
          }
          state.formattedSongInfo = songList[s - 1];
          state.playingSongmid = songList[s - 1].songMid;
          return;
        }

      }
      state.playingSongInfo = 0;
    },
    /**下一曲 */
    [PLAYER_MUSIC.PLAY_NEXT](state, auto) {
      let nowSong = state.formattedSongInfo;
      let songList = state.playSongList;
      let playMode = state.songPlayMode;
      let oldSong = Object.assign({}, nowSong);
      if (auto && playMode === 1) return;
      let songIdx = 0;
      for (let s in state.playSongList) {
        s = parseInt(s);
        if (songList[s].songMid === nowSong.songMid) {
          songIdx = s;
          break;
        }
      }
      /**
       * 根据播放模式 进行操作
       */
      //随机
      if (playMode === 3) {
        //播放列表长度为1
        if (songList.length === 1) {
          state.playingSongNowTime = 0;
          return;
        }
        /**随机函数 */
        function rand(s) {
          let num = Math.round(Math.random() * (songList.length - 1));
          if (num === s) {
            return rand(s);

          }
          console.log(songList.length + '::' + num);
          return num;
        }
        let num = rand(songIdx);
        state.formattedSongInfo = songList[num];
        state.playingSongmid = songList[num].songMid;
        return;
      };
      if (songIdx === songList.length - 1) {
        if (songIdx === 0) {
          state.playingSongNowTime = 0;
          return;
        }
        state.formattedSongInfo = songList[0];
        state.playingSongmid = songList[0].songMid;
        return;
      }
      state.formattedSongInfo = songList[songIdx + 1];
      state.playingSongmid = songList[songIdx + 1].songMid;

      // state.playingSongInfo = 0;
    },
    /**更新当前播放时间 */
    [PLAYER_MUSIC.PLAY_SONG_NOW_TIME_UPDATE](state, time) {
      if (!time) return;
      state.playingSongNowTime = time;
    },
    /**更改播放模式 */
    [PLAYER_MUSIC.PLAY_MODE_CHANGE](state, modeType) {
      let type = parseInt(modeType);
      if (!type || [1, 2, 3, 4].indexOf(type) === -1) return;
      state.songPlayMode = type;
    },
    /**更改播放模式 */
    [PLAYER_MUSIC.PLAY_MODE_SWITCH](state) {
      let nowMode = state.songPlayMode;
      if (nowMode < 4) {
        state.songPlayMode = nowMode + 1;
        return;
      }
      state.songPlayMode = 1;
    },
    /**删除搜索历史记录 */
    [SEARCH_HISTORY.DELETE_ALL](state) {
      window.localStorage.removeItem('search_history');
      state.searchHistory = [];
    },
    /**获取搜索历史记录 */
    [SEARCH_HISTORY.GET](state) {
      if (!state.commit('hasSearchHistory')) return;
      let history = window.localStorage.getItem('search_history');
      let jsonHis = JSON.parse(history);
      state.searchHistory = jsonHis;
    },
    /**添加搜索历史记录 */
    [SEARCH_HISTORY.INC](state, keywords) {
      if (!state.commit('hasSearchHistory')) return;
      let history = window.localStorage.getItem('search_history');
      let searchArr = JSON.parse(history);
      searchArr.push(keywords);
      state.searchHistory = searchArr;
    },
    /**查找历史记录是否存在 */
    [SEARCH_HISTORY.HAS]() {
      let storage = window.localStorage;
      if (!storage && !storage.getItem('search_history')) return false;
      return true;
    },

  },
  actions: {
    getSearchHistory({
      state,
      commit
    }) {
      let storage = window.localStorage;
      if (!storage && !storage.getItem('search_history')) return;
      let history = storage.getItem('search_history');
      let jsonHis = JSON.parse(history);
      state.searchHistory = jsonHis;
    },
    pushSearchHistory({
      state,
      commit
    }, keywords) {
      let storage = window.localStorage;
      let searchArr = [];
      if (!storage.getItem('search_history')) {
        searchArr.push(keywords);

      } else {
        let history = storage.getItem('search_history');
        searchArr = JSON.parse(history);
        if (searchArr.indexOf(keywords) !== -1) return;
        searchArr.unshift(keywords);
      };
      state.searchHistory = searchArr;
      storage.setItem('search_history', JSON.stringify(searchArr));
    }
  }
})