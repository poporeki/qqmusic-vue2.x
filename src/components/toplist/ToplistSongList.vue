<template>
	<!-- 歌曲列表 -->
	<div
		class="song-list"
		v-if="songList&&songList.length!==0"
		ref="song_list"
		@scroll.stop="listenerListScroll"
	>
		<div
			:class="{'list-item':true,playing:s.title!==''&&s.title===playingSongInfo.songName}"
			v-for="(s,sidx) in songList"
			:key="sidx"
			@click="playThis(s)"
		>
			<div class="s-idx">
				<span>{{sidx+1}}</span>

				<div class="rank">
					<i class="iconfont icon-corner-up-left"></i>
					{{s.rankValue}}
				</div>
			</div>
			<div class="lt">
				<div class="s-name">{{s.title}}</div>
				<div class="s-desc">
					<template v-if="singerSpt(s.singerName).length===0">{{s.singerName}}</template>
					<template v-if="singerSpt(s.singerName).length!==0">
						<template v-for="singer in singerSpt(s.singerName)">{{singer+' '}}</template>
					</template>
				</div>
			</div>
			<div class="rt">
				<div @click.stop="showDownload(s)">
					<i class="iconfont icon-download"></i>
				</div>
			</div>
		</div>
	</div>
</template>



<script>
	export default {
		props: {
			reachBottom: {
				type: Boolean,
				default: false
			},
			songList: {
				type: Array
			},
			isRequest: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {};
		},
		methods: {
			singerSpt(singers) {
				return singers.split("/");
			},
			/**监听列表滚动 */
			listenerListScroll(e) {
				if (!this.reachBottom) return;
				let target = e.target;
				let sHei = target.scrollHeight;
				let clientHeight = target.clientHeight;
				let scrollTop = target.scrollTop;
				if (sHei - clientHeight - scrollTop < 50) {
					if (!this.isRequest) {
						this.$emit("getMoreSongData");
					}
				}
			},
			/**跳转MV界面 */
			updateMVInfo(mvobj) {
				this.$store.commit("updateMVInfo", mvobj);
				this.$router.push({ path: "/mv/" + mvobj.vid });
			},
			/**播放 */
			async playThis(info) {
				let songData = await this.getTheSongDetail(info);
				if (songData.pay && songData.pay.pay_play !== 0) return;
				let obj = {
					songName: songData.title,
					songMid: songData.mid,
					albumName: songData.album.name,
					albumMid: songData.album.mid,
					singerArr: songData.singer,
					albumId: songData.album.id,

					albumPic: `//y.gtimg.cn/music/photo_new/T002R300x300M000${
						songData.album.mid ? songData.album.mid : songData.mid
					}.jpg?max_age=2592000`
				};
				this.$store.commit("updatePlayingSongInfo", songData);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			/**获取歌曲详情 */
			getTheSongDetail(info) {
				let that = this;
				let url = "/api/v1/qqmusic/getsongdetail";
				return new Promise((resolve, reject) => {
					that.$axios
						.get(url, { params: { songid: info.songId } })
						.then(({ data }) => {
							if (data.code !== 0) return;
							resolve(data.data_id.data.tracks[0]);
						});
				});
			}
		},
		computed: {
			playingSongMid() {
				return this.$store.state.playingSongmid;
			},
			playingSongInfo() {
				return this.$store.state.formattedSongInfo;
			}
		}
	};
</script>


<style lang="scss" scoped>
	.song-list {
		position: relative;
		height: 100%;

		padding-bottom: 50px;
		overflow-y: auto;
		.list-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 1rem 1rem 1rem 0;
			&.playing {
				color: $music-color;
				border-left: 1px solid $music-color;
			}
			&.disabled {
				color: gray;
				background-color: $disabled-color;
				border-left: 1px solid rgb(168, 168, 168);
			}
			&:hover {
				background-color: rgba(0, 0, 0, 0.041);
			}
			.s-idx {
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: space-between;
				padding: 0 0.5rem 0 1rem;
				font-size: 1rem;
				.iconfont {
					transform: rotate(90deg);
					font-size: 1em;
				}
				.rank {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 0.6em;
					color: gray;
				}
			}
			.lt {
				flex-grow: 1;
				width: 1%;
				padding-right: 1rem;
			}
			.rt {
				display: flex;
				align-items: center;
				.iconfont {
					font-size: 1rem;
				}
			}
			.s-name {
				font-size: 1rem;
			}
			.s-desc {
				font-size: 0.8rem;
				color: gray;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
	}
</style>
