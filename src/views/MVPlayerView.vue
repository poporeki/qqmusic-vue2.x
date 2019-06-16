<template>
	<transition enter-active-class="ani move-in-right" leave-active-class="ani move-out-right">
		<div class="mv-container" v-if="isShow">
			<common-header-item ref="common_header" defaultBackgroundColor="0,0,0,0" :has-bg-shadow="false"></common-header-item>
			<mv-player-item :vid="vid" class="mv-player" ref="mv-item"></mv-player-item>
			<better-scroll-item class="mv-content" ref="mv_content">
				<div class="mv-content-inner">
					<div class="mv-desc">
						<div class="mv-name">
							<span class="icon-mv">MV</span>
							<span>{{mvInfoData.name}}</span>
						</div>
						<div class="mv-singer">
							<template v-for="s in mvInfoData.singers">{{s.name}}</template>
						</div>
						<div
							class="mv-info"
						>{{convertNum(mvInfoData.playcnt)}}次播放&nbsp;&nbsp;&nbsp;{{new Date(mvInfoData.pubdate*1000).toLocaleString()}}</div>
					</div>
					<div class="recom-list">
						<div
							class="r-l-item"
							v-for="(rec,ridx) in recomMVData"
							:key="ridx"
							@click="$router.push({path:'/mv/'+rec.vid})"
						>
							<div class="cover-pic">
								<img :src="rec.cover_pic_medium" alt>
								<div class="play-number">WATCH:{{rec.playcnt}}</div>
							</div>
							<div class="mv-desc list">
								<p class="mv-name">
									<span class="icon-mv">MV</span>
									<span>{{rec.name}}</span>
								</p>
								<p class="mv-from">{{rec.uploader_nick}}</p>
							</div>
						</div>
					</div>
				</div>
			</better-scroll-item>
		</div>
	</transition>
</template>

<script>
	import CommonHeaderItem from "@/components/common/HeaderItem.vue";
	import BetterScrollItem from "@/components/common/BetterScroll";
	import MvPlayerItem from "@/components/MVItem.vue";
	export default {
		components: { MvPlayerItem, CommonHeaderItem, BetterScrollItem },
		data() {
			return {
				isShow: false,
				mvInfoData: {},
				recomMVData: {}
			};
		},
		methods: {
			/**获取MV详情 */
			getMVDescData() {
				let that = this;
				let url = "/api/v1/qqmusic/getmvdesc";
				let params = {
					vid: this.vid
				};
				this.$axios.get(url, { params }).then(({ data }) => {
					if (data.code !== 0) return;
					that.mvInfoData = data.getMVInfo.data[that.vid];
					that.recomMVData = data.getRecomMV.data.list;
				});
			},
			convertNum(num) {
				if (!num) return;
				let n = num.toString();
				let spt = n.split("");
				if (spt < 4) return n;
				let str = spt.slice(0, spt.length - 4).join("") + "万";
				return str;
			}
		},
		computed: {
			vid() {
				return this.$route.params.vid;
			},
			mvinfo() {
				return this.$store.state.playingMVInfo;
			}
		},
		watch: {
			$route(val, oldVal) {
				if (val.params.vid === oldVal.params.vid) return;
				this.getMVDescData();
			}
		},
		mounted() {
			this.isShow = true;
			this.$nextTick(function() {
				this.videoHeight = this.$refs.mv_content.$el.clientHeight;
				this.$refs.mv_content.$el.style.height = this.videoHeight + "px";
			});
		},
		created() {
			this.getMVDescData();
		}
	};
</script>


<style lang="scss">
	.icon-mv {
		margin-right: 0.1em;
		padding: calc(0.2em - 1px);
		border: 1px solid $music-color;
		border-radius: 4px;
		font-size: 0.6em;
		color: $music-color;
	}
	.mv-container {
		position: relative;
		color: #000;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: $base-bg-color;
		.mv-player {
		}
		.mv-content {
			flex-grow: 1;
			height: 100%;
			position: relative;
			overflow: hidden;
			transition: height 0.3s ease;
			.mv-content-inner {
				position: relative;
				padding-bottom: 6rem;
				> .mv-desc {
					padding: 1rem;
					.mv-name {
						font-weight: bold;
					}
				}
			}
		}
	}
	.mv-desc {
		.mv-name {
			font-size: 1em;

			> span {
				vertical-align: middle;
			}
		}
		.mv-singer,
		.mv-info {
			margin: 0.5rem 0;
			font-size: 0.8em;
			color: gray;
		}
	}
	.recom-list {
		display: flex;
		flex-direction: column;
		padding: 10px;
		border-top: 1px solid rgb(221, 221, 221);
		.r-l-item {
			position: relative;
			display: flex;
			flex-direction: row;
			padding: 5px 0;
			.cover-pic {
				position: relative;
				width: 40%;
				> img {
					max-width: 100%;
				}
				.play-number {
					position: absolute;
					bottom: 5px;
					left: 5px;
					font-size: 0.7rem;
					color: #fff;
				}
			}
			.mv-desc {
				width: 60%;
				border-bottom: 1px solid rgb(221, 221, 221);
				padding: 0 10px;
				font-size: 0.9rem;
				> p {
					padding: 0;
					margin: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; // 控制多行的行数
					-webkit-box-orient: vertical;
				}
				.mv-from {
					font-size: 0.8rem;
					color: gray;
				}
			}
		}
	}
</style>
