<template>
	<div class="category-container">
		<!-- Header -->
		<common-header-item
			defaultBackgroundColor="0,0,0,0"
			changedBackgroundColor="0,0,0,1"
			:scrollY="scrollY"
			:scroll-change-bg="true"
			:has-bg-shadow="false"
		></common-header-item>
		<!-- Scroll -->
		<better-scroll-item
			:data="listData.v_item"
			class="better-scroll"
			:probeType="3"
			:listenScroll="true"
			@scroll="onScroll"
		>
			<div class="better-scroll-inner">
				<div class="category-header">
					<div class="cover" v-if="infoData.cover">
						<img :src="infoData.cover.big_url" alt>
					</div>
					<div class="category-title">{{infoData.name}}</div>
				</div>
				<div class="category-content">
					<div class="tab-head">
						<div class="tab-head-item">
							<div>全部</div>
						</div>
					</div>
					<div class="tab-body">
						<div class="tab-body-item">
							<!-- 列表 -->
							<div class="c-i-list cards-wrap">
								<div
									class="c-i-l-item c-l-card"
									v-for="(item,iidx) in listData.v_item"
									:key="iidx"
									@click="goPageAlbum(item.basic.tid)"
								>
									<div class="cover">
										<img :src="item.basic.cover.default_url" alt>
										<div class="icon">
											<i class="iconfont icon-play"></i>
											<span>{{convertNum(item.basic.play_cnt)}}</span>
										</div>
									</div>
									<div class="c-l-card-tit">{{item.basic.title}}</div>
									<div class="c-l-card-from">{{item.basic.creator.nick}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</better-scroll-item>
	</div>
</template>


<script>
	/**公共头 */
	import CommonHeaderItem from "@/components/common/HeaderItem";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { CommonHeaderItem, BetterScrollItem },
		data() {
			return {
				scrollY: 0,
				/**数据请求URL */
				requestUrl: "api/v1/qqmusic/getonecategory",
				/**基本信息 */
				infoData: {},
				/**详细信息 */
				listData: {}
			};
		},
		methods: {
			/**获取分类具体数据 */
			getCategoryData(cid) {
				let that = this;
				let id = cid || this.cid;
				this.$axios.get(this.requestUrl, { params: { id } }).then(({ data }) => {
					if (data.code !== 0) return;
					that.listData = data.list.data.content;
				});
			},
			/**获取分类基本信息 */
			getCategoryBasicData(cid) {
				let that = this;
				let id = cid || this.cid;
				this.$axios
					.get(this.requestUrl, { params: { id, basic: 1 } })
					.then(({ data }) => {
						if (data.code !== 0) return;
						that.infoData = data.info.data.category;
					});
			},
			/**跳转专辑页 */
			goPageAlbum(mid) {
				this.$router.push({
					path: "/songslist/" + mid
				});
			},
			/**转换数字为 111万形式 */
			convertNum(num) {
				let n = num.toString();
				let spt = n.split("");
				if (spt < 4) return n;
				let str = spt.slice(0, spt.length - 4).join("") + "万";
				return str;
			},
			onScroll(pos) {
				this.scrollY = pos.y;
			}
		},
		computed: {
			/**分类id */
			cid() {
				return this.$route.params.id;
			}
		},
		watch: {
			cid(val) {
				this.getCategoryBasicData(val);
				this.getCategoryData(val);
			}
		},

		created() {
			this.getCategoryBasicData();
			this.getCategoryData();
		}
	};
</script>


<style lang="scss">
	.category-container {
		position: relative;
		width: 100%;
		height: 100%;

		.better-scroll {
			position: relative;
			height: 100%;
			.better-scroll-inner {
				padding-bottom: 6rem;
			}
		}
		.category-header {
			position: relative;
			.cover {
				z-index: 1;
			}
			.category-title {
				position: absolute;
				bottom: 30%;
				font-size: 2rem;
				color: #fff;
				z-index: 2;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
</style>
