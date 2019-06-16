<template>
	<transition enter-active-class="ani move-in-bottom" leave-active-class="ani move-out-bottom">
		<div class="search-result-box">
			<div class="tab-box">
				<div class="tab-head">
					<div class="tab-head-item">
						<div class="tit">歌曲</div>
					</div>
				</div>
				<div class="tab-body" ref="tabBody">
					<better-scroll-item
						class="tab-body-item"
						:data="songList"
						:pulldown="pulldown"
						:pullup="pullup"
						@scrollToEnd="onScrollToEnd"
						@pulldown="getMoreSongListData"
					>
						<div class="tab-body-item-inner">
							<div class="best-match" v-show="zhida&&zhida.type">
								<div class="tit">最佳匹配</div>
								<!-- 歌手 -->
								<div
									class="match-type singer"
									v-if="zhida_singer"
									@click="goPageSinger(zhida_singer.singerMID)"
								>
									<div class="item">
										<div class="pic">
											<img
												:src="zhida_singer.singerPic"
												onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000'"
												alt
											>
										</div>
										<div class="info">
											<div class="type-name">{{zhida_singer.singerName}}</div>
											<div
												class="work"
											>歌曲：{{zhida_singer.songNum}} 专辑：{{zhida_singer.albumNum}} 视频：{{zhida_singer.mvNum}}</div>
										</div>
									</div>
								</div>
								<!-- 专辑 -->
								<div class="match-type album" v-if="zhida_album" @click="goPageAlbum(zhida_album.albumMID)">
									<div class="item">
										<div class="pic">
											<img :src="zhida_album.albumPic" alt>
										</div>
										<div class="info">
											<div class="type-name">专辑：{{zhida_album.albumName}}</div>
											<div class="work">{{zhida_album.singerName}}</div>
										</div>
									</div>
								</div>
								<!-- MV -->
								<div class="match-type mv" v-if="zhida_mv" @click.stop="updateMVInfo(zhida_mv)">
									<div class="item">
										<div class="pic">
											<img :src="zhida_mv.pic" alt>
											<i class="iconfont icon-play"></i>
										</div>
										<div class="info">
											<div class="type-name">MV:{{zhida_mv.title}}</div>
											<div class="work">{{zhida_mv.desc}}</div>
										</div>
									</div>
								</div>
							</div>
							<!-- 歌曲列表 -->
							<div class="song-list" v-if="songList.length!==0">
								<div
									:class="{'list-item':true, disabled:s.pay.payplay!==0||s.songmid==='',playing:s.songmid!==''&&s.songmid===playingSongMid}"
									v-for="(s,sidx) in songList"
									:key="sidx"
									@click="playThis(s)"
								>
									<div class="lt">
										<div class="s-name">
											{{s.songname}}
											<span
												@click.stop="updateMVInfo(s)"
												class="icon-mv"
												v-show="s.vid&&s.vid!==''"
											>
												<span>MV</span>
											</span>
										</div>
										<div class="s-desc">
											<template v-for="singer in s.singer">{{singer.name}}</template>
											-
											{{s.albumname}}
										</div>
									</div>
									<div class="rt">
										<div @click.stop="showDownload(s)">
											<i class="iconfont icon-download"></i>
										</div>
									</div>
								</div>
								<request-loading-item v-show="isRequest"></request-loading-item>
							</div>
						</div>
					</better-scroll-item>
				</div>
			</div>
			<!-- 下载块 -->
			<div class="download-box" v-show="isShowDownloadBox" @click="isShowDownloadBox=false">
				<div class="d-list">
					<div
						class="d-list-item"
						v-show="toDownloadSong&&toDownloadSong.size128"
						@click="downloadThis('128k')"
					>128K {{toMB(toDownloadSong.size128)}}</div>
					<div
						class="d-list-item not"
						v-show="toDownloadSong&&toDownloadSong.size320"
						@click="downloadThis('320k')"
					>320K {{toMB(toDownloadSong.size320)}}</div>
					<div
						class="d-list-item not"
						v-show="toDownloadSong&&toDownloadSong.sizeape"
						@click="downloadThis('ape')"
					>Ape {{toMB(toDownloadSong.sizeape)}}</div>
					<div
						class="d-list-item not"
						v-show="toDownloadSong&&toDownloadSong.sizeflac"
						@click="downloadThis('flac')"
					>Flac {{toMB(toDownloadSong.sizeflac)}}</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from "better-scroll";
	import BetterScrollItem from "@/components/common/BetterScroll";
	import RequestLoadingItem from "@/components/common/RequestLoading_List";
	export default {
		components: { BetterScrollItem, RequestLoadingItem },
		data() {
			return {
				page: 1,
				limit: 10,
				isRequest: false,
				toDownloadSong: {},
				isShowDownloadBox: false,
				searchedData: {},
				song: {},
				songList: [],
				pullup: true,
				pulldown: true
			};
		},
		props: {
			data: {
				type: Object
			},
			isShow: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			toMB(num) {
				return (num / 1024 / 1024).toFixed(2) + "MB";
			},
			async downloadThis(text) {
				let songmid = this.toDownloadSong.songmid;
				let result = await this.getSongVkey(songmid);
				let vkey = result.req_0.data.midurlinfo[0].vkey;
				let purl = result.req_0.data.midurlinfo[0].purl;
				let guid = purl
					.split("?")[1]
					.split("guid=")[1]
					.split("&")[0];
				let url = "";
				switch (text) {
					case "128k":
						url = `http://dl.stream.qqmusic.qq.com/M500${songmid}.mp3?vkey=${vkey}&guid=${guid}&uin=0&fromtag=53`;
						break;
					case "320k":
						url = `http://dl.stream.qqmusic.qq.com/M800${songmid}.mp3?vkey=${vkey}&guid=${guid}&uin=0&fromtag=53`;
						break;
					case "ape":
						url = `http://dl.stream.qqmusic.qq.com/A000${songmid}.ape?vkey=${vkey}&guid=${guid}&uin=0&fromtag=53`;
						break;
					case "flac":
						url = `http://dl.stream.qqmusic.qq.com/F000${songmid}.flac?vkey=${vkey}&guid=${guid}&uin=0&fromtag=53`;
						break;
				}
				var a = window.open(url);
				a.document.execCommand("Saveas");
				// a.window.close();
			},
			/**获取vkey */
			getSongVkey(songmid) {
				return new Promise(async (resolve, reject) => {
					let that = this;
					let url = "/api/v1/qqmusic/getSongVkey";
					try {
						let data = await this.$axios.get(url, {
							params: {
								song_mid: songmid
							}
						});
						resolve(data.data);
					} catch (err) {
						reject(err);
					}
				});
			},
			onScrollToEnd() {
				this.getMoreSongListData()
					.then(data => {
						this.page += 1;
						this.songList = this.songList.concat(data.list);
					})
					.catch(err => {
						this.isRequest = false;
					});
			},
			/**监听列表滚动 */
			listenerListScroll(e) {
				let target = e.target;
				let sHei = target.scrollHeight;
				let clientHeight = target.clientHeight;
				let scrollTop = target.scrollTop;
				if (sHei - clientHeight - scrollTop < 50) {
					this.getMoreSongListData();
				}
			},
			getMoreSongListData() {
				return new Promise((resolve, reject) => {
					if (this.isRequest) return reject("Is requesting");
					let that = this;
					let page = this.page;
					let limit = this.limit;
					let url = "/api/v1/qqmusic/search";
					this.isRequest = true;
					let params = {
						keywords: this.data.keyword,
						page,
						limit
					};
					this.$axios
						.get(url, { params })
						.then(({ data }) => {
							this.isRequest = false;
							if (data.code !== 0 || !data.data.song) reject(0);
							resolve(data.data.song);
						})
						.catch(err => {
							reject(err);
							this.isRequest = false;
						});
				});
			},
			/**显示下载选项 */
			showDownload(data) {
				this.isShowDownloadBox = true;
				this.toDownloadSong = data;
			},
			/**更新播放歌曲mid */
			playingMid(mid) {
				return this.$store.commit("updatePlayingSongmid", mid);
			},
			/**跳转MV界面 */
			updateMVInfo(mvobj) {
				this.$store.commit("updateMVInfo", mvobj);
				this.$router.push({ path: "/mv/" + mvobj.vid });
				this.closeSearchBox;
			},
			/**播放 */
			playThis(info) {
				if (info.pay && info.pay.payplay !== 0) return;
				this.playingMid(info.songmid);
				let obj = {
					songName: info.songname,
					songMid: info.songmid,
					albumName: info.albumname,
					albumMid: info.albummid,
					singerArr: info.singer,
					albumId: info.songmid,
					albumPic: `//y.gtimg.cn/music/photo_new/T002R300x300M000${
						info.albummid
					}.jpg?max_age=2592000`
				};
				this.$store.commit("updatePlayingSongInfo", info);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			goPageAlbum(mid) {
				this.$store.commit("changeSearchBoxStatus", false);
				this.$router.push({ path: "/album/" + mid });
			},
			goPageSinger(mid) {
				this.$store.commit("changeSearchBoxStatus", false);
				this.$router.push({ path: "/singer/" + mid });
			}
		},
		watch: {
			data(val) {
				this.page = 2;
				this.searchedData = val;
				this.song = val.song;
			}
		},
		mounted() {},
		created() {
			let that = this;
			this.page = 2;
			this.searchedData = this.data;
			this.song = this.data.song;
			that
				.getMoreSongListData()
				.then(data => {
					that.page += 1;
					that.songList = that.songList.concat(data.list);
				})
				.catch(err => {
					that.isRequest = false;
				});
		},
		computed: {
			/**播放中歌曲的mid */
			playingSongMid() {
				return this.$store.state.playingSongmid;
			},
			closeSearchBox() {
				return this.$store.commit("changeSearchBoxStatus", false);
			},
			/**zhida */
			zhida() {
				return this.searchedData.zhida || undefined;
			},
			zhida_mv() {
				return this.zhida ? this.zhida.zhida_mv : undefined;
			},
			zhida_singer() {
				return this.zhida ? this.zhida.zhida_singer : undefined;
			},
			zhida_album() {
				return this.zhida ? this.zhida.zhida_album : undefined;
			}
		}
	};
</script>


<style lang="scss">
	.search-result-box {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: $base-bg-color;
		.tab-box {
			position: relative;
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			.tab-head {
				padding: 10px 0;
				background-color: $bg-color;
				box-shadow: 0 5px 10px rgba(0, 0, 0, 0.041);
				z-index: 2;
			}
			.tab-body {
				position: relative;
				flex-grow: 1;
				background-color: $base-bg-color;
				color: #000;
				height: 100%;
				z-index: 1;
				.tab-body-item {
					position: relative;
					height: 100%;
					.tab-body-item-inner {
						position: relative;
						width: 100%;
						padding-bottom: 6rem;
					}
				}
			}
		}
		.tab-head-item {
			.tit {
				padding: 5px 10px;
				text-align: center;
			}
		}
		.tab-body-item {
			position: relative;
			height: 100%;
			.tab-body-item-inner {
				position: relative;
				width: 100%;
			}
		}
		.icon-mv {
			padding: 1px 6px;
			border: 1px solid $music-color;
			border-radius: 4px;
			font-size: 0.5rem;
			color: $music-color;
			vertical-align: middle;
		}
		.song-list {
			margin-bottom: 50px;
			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 20px 20px;
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
				.lt {
					flex-grow: 1;
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
					display: flex;
					align-items: center;
				}
				.s-desc {
					font-size: 0.9rem;
					color: gray;
				}
			}
		}
		.best-match {
			padding: 1rem;
			.tit {
				margin: 10px 0;
				color: $text-color-default-secondary;
				font-size: 0.8rem;
			}
			.match-type {
				.item {
					display: flex;
					flex-direction: row;
					align-items: center;
					.pic {
						flex-basis: 20%;
						margin-right: 10px;
						> img {
							border-radius: 50%;
							max-width: 100%;
						}
					}

					.info {
						margin-left: 10px;
						width: 1%;
						flex-grow: 1;
						.work {
							font-size: 0.9rem;
							color: $text-color-default-secondary;
						}
					}
				}
				&.album {
					.pic {
						z-index: 1;
						position: relative;
						> img {
							border-radius: 4px;
						}
						&::after {
							content: "";
							position: absolute;
							top: 0;
							right: -30%;
							border-radius: 50%;
							width: 100%;
							height: 100%;
							background-color: rgba(150, 150, 150, 0.705);
							transform: scale(0.7);
							z-index: -1;
						}
					}
				}
				&.mv {
					.pic {
						z-index: 1;
						flex-basis: 30%;
						position: relative;
						> img {
							border-radius: 4px;
						}
						> .iconfont {
							position: absolute;
							top: 50%;
							left: 50%;
							font-size: 2rem;
							color: #fff;
							transform: translate(-50%, -50%);
						}
					}
				}
			}
		}
		.download-box {
			display: flex;
			position: fixed;
			width: 100vw;
			height: 100vh;
			left: 0;
			top: 0;
			justify-content: center;
			align-items: center;
			background-color: rgba(0, 0, 0, 0.192);
			.d-list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-around;
				.d-list-item {
					flex-basis: 50%;
					margin: 10px 20px;
					padding: 10px;
					border-radius: 20px;
					color: #fff;
					background-color: rgba(255, 153, 0, 0.808);
					&.not {
						background-color: rgb(150, 150, 150);
					}
				}
			}
		}
	}
</style>

