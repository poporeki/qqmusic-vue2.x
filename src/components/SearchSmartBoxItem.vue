<template>
	<div class="smart-box-container" v-show="isShowSmartBox">
		<div class="s-b-section album" v-show="sectionIsShow('album')">
			<div class="s-b-s-tit">{{smartBoxData.album.name}}</div>
			<div class="item-list">
				<!-- <div>{{smartBoxData}}</div> -->
				<div
					class="item"
					v-for="(li,iidx) in smartBoxData.album.itemlist"
					:key="iidx"
					@click="goPage('/album/'+li.mid)"
				>{{li.name}}</div>
			</div>
		</div>
		<div class="s-b-section" v-show="sectionIsShow('mv')">
			<div class="s-b-s-tit">{{smartBoxData.mv.name}}</div>
			<div class="item-list">
				<!-- <div>{{smartBoxData}}</div> -->
				<div
					class="item"
					v-for="(li,iidx) in smartBoxData.mv.itemlist"
					:key="iidx"
					@click="goPage('/mv/'+li.vid)"
				>{{li.name}}</div>
			</div>
		</div>
		<div class="s-b-section" v-show="sectionIsShow('singer')">
			<div class="s-b-s-tit">{{smartBoxData.singer.name}}</div>
			<div class="item-list">
				<!-- <div>{{smartBoxData}}</div> -->
				<div
					class="item"
					v-for="(li,iidx) in smartBoxData.singer.itemlist"
					:key="iidx"
					@click="goPage('/singer/'+li.mid)"
				>{{li.name}}</div>
			</div>
		</div>
		<div class="s-b-section" v-show="sectionIsShow('song')">
			<div class="s-b-s-tit">{{smartBoxData.song.name}}</div>
			<div class="item-list">
				<!-- <div>{{smartBoxData}}</div> -->
				<div
					class="item"
					v-for="(li,iidx) in smartBoxData.song.itemlist"
					:key="iidx"
					@click="playThis(li)"
				>{{li.name}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			keywords: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/searchSmartBox",
				isShowSmartBox: false,
				smartBoxData: {
					album: {},
					mv: {},
					singer: {},
					song: {}
				}
			};
		},
		methods: {
			sectionIsShow(sName) {
				return (
					this.smartBoxData[sName] &&
					Object.keys(this.smartBoxData[sName]).length !== 0 &&
					this.smartBoxData[sName].itemlist.length !== 0
				);
			},
			/**联想 */
			getSmartBoxData(keywords) {
				let that = this;
				let url = "/api/v1/qqmusic/searchSmartBox";
				let kws = (typeof keywords !== "object" && keywords) || this.keywords;
				this.$axios
					.get(this.requestUrl, {
						params: {
							keywords: kws
						}
					})
					.then(({ data }) => {
						if (data.code !== 0) {
							return;
						}
						for (let val in data.data) {
							that.smartBoxData[val] = data.data[val];
						}

						that.isShowSmartBox = true;
					});
			},
			goPage(path) {
				this.$router.push({
					path: path || "/"
				});
				this.closeThis;
			},
			/**播放 */
			async playThis(info) {
				let songData = await this.getTheSongDetail(info.mid);
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
				this.$store.commit("updatePlayingSongmid", songData.mid);
				this.$store.commit("updatePlayingSongInfo", songData);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			/**获取歌曲详情 */
			getTheSongDetail(mid) {
				let that = this;
				let url = "/api/v1/qqmusic/getsongdetail";
				return new Promise((resolve, reject) => {
					that.$axios.get(url, { params: { songid: mid } }).then(({ data }) => {
						if (data.code !== 0) return;
						resolve(data.data_id.data.tracks[0]);
					});
				});
			}
		},
		watch: {
			keywords(val) {
				if (!val) {
					this.isShowSmartBox = false;
				}
				this.getSmartBoxData(val);
			},
			isShowSearchResultBox(val) {
				if (val) {
					this.isShowSmartBox = false;
				}
			}
		},
		computed: {
			isShowSearchResultBox() {
				return this.$store.state.isShowSearchBox;
			},
			closeThis() {
				return this.$store.commit("changeSearchBoxStatus", false);
			}
		}
	};
</script>


<style lang="scss">
	.smart-box-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: auto;
		background-color: $base-bg-color;
		.s-b-section {
			margin: 1rem 1rem 0 1rem;

			.s-b-s-tit {
				padding: 0.5rem 0;
				font-size: 1.1rem;
				border-bottom: 1px solid rgb(216, 216, 216);
			}
			.item-list {
				color: gray;
				padding: 0.5rem 0;
				.item {
					padding: 0.5rem 0;
				}
			}
		}
	}
</style>

