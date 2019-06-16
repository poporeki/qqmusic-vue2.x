<template>
	<div class="top-list-container">
		<common-header-item
			:scrollY="scrollY"
			:scrollChangeBg="true"
			:scrollHeight="200"
			title-color="0,0,0,1"
			:changeTitleColor="true"
		></common-header-item>
		<better-scroll-item class="top-list-body" :probeType="3" :listenScroll="true" @scroll="onScroll">
			<div class="top-list-body-inner">
				<div class="top-list">
					<div class="t-l-item" v-for="(item,iidx) in topList" :key="iidx" @click="goTopList(item.id)">
						<div class="lt">
							<div class="tit">{{getToplistTitle(item.topTitle)}}</div>
							<div class="song-list">
								<div class="s-l-item" v-for="(song,sidx) in item.songList" :key="sidx">
									{{sidx+1}}.{{song.songname}}-
									<span class="singer">{{song.singername}}</span>
								</div>
							</div>
						</div>
						<div class="rt">
							<div class="i-pic">
								<img :src="item.picUrl" alt>
							</div>
						</div>
					</div>
				</div>
			</div>
		</better-scroll-item>
	</div>
</template>


<script>
	import CommonHeaderItem from "@/components/common/HeaderItem";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { CommonHeaderItem, BetterScrollItem },
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/gettoplist",
				topList: [],
				scrollY: 0
			};
		},
		methods: {
			/**得到Top标题 */
			getToplistTitle(title) {
				let titSpt = title.split("·");
				return titSpt.length > 1 ? titSpt[1] + "榜" : title;
			},
			/**获取toplist */
			getToplistData() {
				let that = this;
				this.$axios.get(this.requestUrl).then(({ data }) => {
					if (data.code !== 0) return;
					that.topList = data.data.topList;
				});
			},
			/**跳转排行榜 */
			goTopList(id) {
				this.$router.push({
					path: "toplist/" + id
				});
			},
			onScroll(pos) {
				this.scrollY = pos.y;
			}
		},
		created() {
			this.getToplistData();
		}
	};
</script>


<style lang="scss">
	.top-list-container {
		position: relative;
		height: 100%;
		padding-top: 4rem;
		.top-list-body {
			position: relative;
			height: 100%;
			padding: 0 1rem;
			.top-list-body-inner {
				position: relative;
				padding-bottom: 6rem;
			}
			.top-list {
				.t-l-item {
					display: flex;
					align-content: stretch;
					flex-direction: row;
					margin-bottom: 1rem;
					border-radius: 4px;
					background-color: rgb(231, 231, 231);
					overflow: hidden;
					color: #000;
					font-size: 1rem;
					.lt {
						flex-grow: 1;
						padding: 0.5em;
						width: 1%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					.rt {
						flex-basis: 30%;
					}
					.i-pic {
						> img {
							display: block;
							max-width: 100%;
						}
					}
					.tit {
						font-size: 1em;
						font-weight: bold;
					}
					.song-list {
						font-size: 0.9em;
						.s-l-item {
							.singer {
								color: $text-color-default-secondary;
							}
						}
						> div {
							overflow: hidden; /*超出部分隐藏*/
							white-space: nowrap; /*不换行*/
							text-overflow: ellipsis; /*超出部分文字以...显示*/
						}
					}
				}
			}
		}
	}
</style>

