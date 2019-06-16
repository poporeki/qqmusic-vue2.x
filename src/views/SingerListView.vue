<template>
	<div class="singerlist-container">
		<common-header
			:r="255"
			:g="255"
			:b="255"
			ref="common_header"
			:is-change-bg="false"
			titleColor="#000"
		></common-header>
		<div class="tags-list-wrapper" :style="{marginTop:tagsListTop}" ref="tags_wrapper">
			<div class="tags-list listarea-list">
				<swiper style="width:100%;" :options="swiperOption" v-if="Object.keys(tags).length!==0">
					<swiper-slide v-for="(tag,tidx) in tags.area" :key="tidx">
						<div
							:class="{lk:true,active:requertParams.area===tag.id}"
							@click="requertParams.area=tag.id"
						>{{tag.name}}</div>
					</swiper-slide>
				</swiper>
			</div>
			<div class="tags-list genre-list">
				<swiper :options="swiperOption" v-if="Object.keys(tags).length!==0">
					<swiper-slide v-for="(tag,tidx) in tags.genre" :key="tidx">
						<div
							:class="{lk:true,active:requertParams.genre===tag.id}"
							@click="requertParams.genre=tag.id"
						>{{tag.name}}</div>
					</swiper-slide>
				</swiper>
			</div>
			<div class="tags-list fixed-list index-list" :style="{top:tagIndexTop}" ref="type_index_list">
				<div v-for="(tag,tidx) in tags.index" :key="tidx">
					<div
						:class="{lk:true,active:requertParams.index===tag.id}"
						@click="requertParams.index=tag.id"
					>{{tag.name}}</div>
				</div>
			</div>
		</div>
		<div class="type-title" v-if="Object.keys(tags).length!==0" ref="type_title">{{nowIndex()}}</div>

		<better-scroll-item
			class="singer-list"
			:data="singerList"
			:listenScroll="true"
			:pullup="true"
			:probeType="2"
			@scroll="onScroll"
			@scrollToEnd="onScrolltoEnd"
			:scrollEnd="true"
			@scrollEnd="onScrollEnd"
			ref="el_scroll"
		>
			<transition-group
				tag="div"
				class="singer-list-inner"
				ref="singer_list"
				enter-active-class="ani fade-in"
				leave-active-class="ani fade-out"
			>
				<div v-if="!isRequest&&singerList.length===0" class="no-singer" key="no-data">该分类下暂无歌手！</div>
				<div
					class="s-l-item"
					v-for=" (singer,sidx) in singerList"
					:key="sidx"
					@click="goSingerDesc(singer.singer_mid)"
				>
					<div class="s-pic">
						<img
							:src="singer.singer_pic"
							alt
							onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000';"
						>
					</div>
					<div class="s-info">{{singer.singer_name}}</div>
				</div>
				<list-loading v-show="isRequest" key="requestLoadingItem"></list-loading>
			</transition-group>
		</better-scroll-item>
	</div>
</template>

<script>
	/*公共头部 */
	import commonHeader from "@/components/common/HeaderItem";
	/* 列表loading动画*/
	import listLoading from "@/components/common/RequestLoading_List";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { commonHeader, listLoading, BetterScrollItem },
		data() {
			return {
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 4,
					watchSlidesProgress: true,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				},
				tags: {},
				isRequest: false,
				cur_page: 1,
				/**请求参数 */
				requertParams: {
					area: -100,
					index: -100,
					genre: -100,
					sex: -100
				},
				singerList: [],
				isUseList: false,
				commonHeaderValue: 0,
				tagsListHeightValue: 0
			};
		},
		methods: {
			/**获取列表数据 */
			getSingerListData() {
				if (this.isRequest) return;
				this.isRequest = true;
				let params = this.requertParams;
				params["cur_page"] = this.cur_page;
				let that = this;
				let url = "/api/v1/qqmusic/getsingerlist";
				this.$axios.get(url, { params }).then(({ data }) => {
					this.isRequest = false;
					if (data.code !== 0 || data.singerList.code !== 0) return;
					this.$nextTick(function() {
						this.tagsListHeightValue = this.$refs.tags_wrapper.clientHeight;
					});
					let resData = data.singerList.data;
					that.tags = resData.tags;
					that.singerList = that.singerList.concat(resData.singerlist);
				});
			},
			/**跳转详情 */
			goSingerDesc(mid) {
				this.$router.push({
					path: "singer/" + mid
				});
			},
			nowIndex() {
				let that = this;
				let result = that.tags.index.find(
					val => val.id === that.requertParams.index
				);
				return result.name;
			},
			/**滚动途中 */
			onScroll(pos) {
				if (!this.isUseList && pos.y < 0) {
					this.isUseList = true;
				}
			},
			/**滚动到底部 */
			onScrolltoEnd(e) {
				this.cur_page += 1;
				this.getSingerListData();
			},
			/**滚动结束时 */
			onScrollEnd(e) {
				if (e.y == 0 && this.isUseList) {
					this.isUseList = false;
				}
			}
		},
		computed: {
			/**标签列表marginTop */
			tagsListTop() {
				return (this.isUseList ? -this.tagsListHeightValue : 0) + "px";
			},
			/**字母索引Top */
			tagIndexTop() {
				return (
					(this.isUseList
						? this.commonHeaderValue + 10
						: this.tagsListHeightValue + this.commonHeaderValue) + "px"
				);
			}
		},
		watch: {
			requertParams: {
				handler(val) {
					this.cur_page = 1;
					this.singerList = [];
					this.getSingerListData();
				},
				deep: true
			}
		},
		created() {
			this.getSingerListData();
		},
		mounted() {
			this.$nextTick(function() {
				this.$refs.el_scroll.$el.style.height =
					this.$refs.el_scroll.$el.clientHeight -
					this.$refs.tags_wrapper.clientHeight +
					"px";
				this.tagsListHeightValue = this.$refs.tags_wrapper.clientHeight;
				this.commonHeaderValue = this.$refs.common_header.$el.clientHeight;
			});
		},
		destroyed() {}
	};
</script>

<style lang="scss">
	.singerlist-container {
		position: relative;
		padding-top: 3rem;
		height: 100%;
		color: #000;
		font-size: 0.9rem;
		.tags-list-wrapper {
			position: relative;
			padding: 1rem 0;
			transition: margin-top 0.3s ease;
			.tags-list {
				padding: 0.5rem 0;
				&.fixed-list {
					position: fixed;
					right: 1rem;
					z-index: 101111;
					font-size: 0.8em;
					transition: top 0.3s ease;
					.lk {
						padding: 1px;
						border-radius: 0;
					}
				}
				&.index-list {
					z-index: 1;
				}
			}

			.lk {
				font-size: 0.9em;
				text-align: center;
				background-color: rgb(255, 255, 255);
				border-radius: 50px;
				padding: 0.6em 1em;
				word-break: keep-all;
				&.active {
					background-color: $music-color;
					color: #fff;
				}
			}
		}
		.type-title {
			position: absolute;
			font-size: 1.2rem;
			width: 100%;
			font-weight: bold;
			padding: 0.1rem 1rem;
			background-color: #f7f7f7;
		}
		.singer-list {
			display: flex;

			height: 100%;
			margin-top: 2rem;
			flex-direction: column;
			overflow: hidden;
			.singer-list-inner {
				padding-bottom: 3rem;
			}
			.no-singer {
				flex-grow: 1;
				justify-self: center;
				align-self: center;
				text-align: center;
			}

			.s-l-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 1rem;
				.s-pic {
					flex-basis: 20%;
					margin-right: 1rem;
					> img {
						border-radius: 50%;
						display: block;
						max-width: 100%;
					}
				}
			}
		}
	}
</style>

