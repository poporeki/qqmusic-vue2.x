/**音乐播放器 */
export const PLAYER_MUSIC = {
  CHANGE_DISPLAY_STATUS: 'changeMusicPlayerDisplayStatus',
  SONG_LIST_INC: 'incSongList',
  SONG_LIST_REDUCE: 'reduceSongList',
  SONG_LIST_SWITCH: 'changePlaySongListDisplayStatus',
  PLAY_SONG_INFO_UPDATE: 'updatePlayingSongInfo',
  PLAY_SONG_MID_UPDATE: 'updatePlayingSongmid',
  PLAY_SONG_INFO_FORMATE: 'formatPlayingSongInfo',
  PLAY_SONG_NOW_TIME_UPDATE: 'updatePlayingSongNowTime',
  PLAY_MODE_CHANGE: 'changeMusicPlayerPlayMode',
  PLAY_MODE_SWITCH: 'switchMusicPlayerPlayMode',
  PLAY_SWITCH: 'switchPlay',
  PLAY_NEXT: 'songPlayNext',
  PLAY_PREV: 'songPlayPrev',
  PLAY_PAUSE: 'pausePlay',
  LYRIC_NOW_LINE_GET: '',
  LYRIC_NOW_LINE_SET: 'updatePlayingSongNowLyricLine',

}
/**MV播放器 */
export const PLAYER_MV = {
  DATA_UPDATE: 'updateMVInfo'
}
/**搜索栏 */
export const SEARCH_BOX = {
  CHANGE_DISPLAY_STATUS: 'changeSearchBoxStatus',

}
/**
 * 搜索历史
 */
export const SEARCH_HISTORY = {
  DELETE_ALL: 'deleteSearchHistory',
  GET: 'getSearchHistory',
  INC: 'pushSearchHistory',
  HAS: 'hasSearchHistory'
}