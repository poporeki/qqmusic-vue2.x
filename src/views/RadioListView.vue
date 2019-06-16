<template>
	<div class="radio-list-container">
		<common-header-item title-color="0,0,0,1" :is-change-bg="false"></common-header-item>
		<div class="radio-list-anchor">
			<div class="r-l-a-header">
				<div class="a-header" style="display:none;">
					<div class="a-h-item" v-for="(item,iidx) in groupList" :key="iidx">{{item.name}}</div>
				</div>
			</div>
			<div class="r-l-a-body">
				<better-scroll-item :data="groupList" class="radio-list">
					<div class="radio-list-inner">
						<better-scroll-item
							:data="item.radioList"
							class="radio-list-item"
							v-for="(item,iidx) in groupList"
							:key="iidx"
						>
							<div class="radio-list-item-inner">
								<div
									class="item-child-item"
									v-for="(c,cidx) in item.radioList"
									:key="cidx"
									@click="getThisRadioInfo(c)"
								>
									<img :src="c.radioImg" alt>
									{{c.radioName}}
								</div>
							</div>
						</better-scroll-item>
					</div>
				</better-scroll-item>
			</div>
		</div>
	</div>
</template>


<script>
	import CommonHeaderItem from "@/components/common/HeaderItem";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { CommonHeaderItem, BetterScrollItem },
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getradiolist",
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 2,
					slidesPerColumn: 2, //显示2行
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				},
				groupList: [],
				songList: []
			};
		},
		methods: {
			/**获取电台列表 */
			getRadioList() {
				let that = this;
				this.$axios.get(this.requestUrl).then(({ data }) => {
					if (data.code !== 0) return;
					that.groupList = data.data.data.groupList;
				});
			},
			insertPlaySongList() {},
			/**获取电台歌曲 */
			getThisRadioInfo(radio) {
				let that = this;
				let url = "/api/v1/qqmusic/getRadioSongList/";
				this.$axios.get(url + radio.radioId).then(({ data }) => {
					that.songList = data.songlist.data.track_list;
					that.songList.map((info, iidx) => {
						if (info.pay && info.pay.pay_play !== 0) return;
						let obj = {
							songName: info.name,
							songMid: info.mid,
							albumName: info.album.name,
							albumMid: info.album.mid,
							singerArr: info.singer,
							albumId: info.album.id,

							albumPic: `//y.gtimg.cn/music/photo_new/T002R300x300M000${
								info.album.mid ? info.album.mid : info.mid
							}.jpg?max_age=2592000`
						};
						if (iidx === 0) {
							that.playThis(obj);
						}
						that.playingListInsert(obj);
					});
				});
			},
			/**添加电台歌曲列表到当前播放列表 */
			playingListInsert(songInfo) {
				return this.$store.commit("incSongList", songInfo);
			},
			/**播放 */
			playThis(songInfo) {
				return this.$store.commit("formatPlayingSongInfo", songInfo);
			}
		},
		computed: {
			/**下一曲 */
			playNext() {
				return this.$store.commit("songPlayNext");
			}
		},
		created() {
			this.getRadioList();
		}
	};
</script>

<style lang="scss">
	.radio-list-container {
		position: relative;
		height: 100%;
		padding-top: 3rem;
	}
	.radio-list-anchor {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		.r-l-a-header {
			display: flex;
			flex-direction: row;
			width: 100%;
			.a-header {
				display: flex;
				flex-direction: row;
				overflow: auto;
				padding: 0 2rem;
				.a-h-item {
					padding: 1rem 2rem;
				}
			}
		}
		.r-l-a-body {
			display: flex;
			flex-direction: row;
			padding: 0 2rem;
			flex-grow: 1;
			height: 100%;
			.radio-list {
				.radio-list-item {
					position: relative;
				}
				.radio-list-item-inner {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					justify-content: space-between;
				}
				.item-child-item {
					flex-basis: 30%;
					padding: 0.5rem;
					overflow: hidden;
					img {
						border-radius: 4px;
					}
				}
			}
		}
	}
</style>
