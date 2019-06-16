<template>
	<div class="category-zone-container" v-if="!isRequest">
		<common-header-item title-color="0,0,0,1" shadow-alpha="0.2"></common-header-item>
		<better-scroll-item class="category-list-container">
			<div class="category-list-inner">
				<!-- ############ area ############ -->
				<div class="c-list-wrap area" v-if="Object.keys(areaData).length!==0">
					<div class="c-l-tit">{{areaData.shelf.title_template}}</div>
					<div class="cards-wrap">
						<div
							class="c-l-card"
							@click="goPageArea(card.id)"
							v-for="(card,cidx) in areaData.shelf.v_niche[0].v_card"
							:key="cidx"
						>
							<div class="c-l-card-tit">{{card.title}}</div>
							<img class="c-l-card-img" :src="card.cover" alt>
						</div>
					</div>
				</div>
				<!-- ############ menu ############ -->
				<div class="c-list-wrap" v-if="Object.keys(areaData).length!==0">
					<div class="c-l-tit">
						推荐分类
						<div class="more" @click="$router.push({path:'categoryall'})">更多></div>
					</div>
					<div class="c-list">
						<div
							class="c-l-item"
							v-for="(menu,midx) in menuData.v_item"
							:key="midx"
							@click="goPageCategory(menu.id)"
						>
							<div class="c-l-tit">{{menu.name}}</div>
						</div>
					</div>
				</div>
				<!-- ############ activity ############ -->
				<div class="c-list-wrap activity" v-for="(act,aidx) in activityData.v_item" :key="aidx">
					<div class="c-l-tit">{{act.title}}</div>
					<div class="cards-wrap">
						<div
							class="c-l-card"
							v-for="(item,iidx) in act.v_item"
							:key="iidx"
							@click="goPageSongsList(item.tid)"
						>
							<div class="cover">
								<img :src="item.cover.default_url" alt>
								<div class="icon">
									<i class="iconfont icon-play"></i>
									<span>{{convertNum(item.play_cnt)}}</span>
								</div>
							</div>
							<div class="c-l-card-tit">{{item.title}}</div>
							<div class="c-l-card-from">{{item.creator.nick}}</div>
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
				isInited: false,
				isRequest: false,
				requestUrl: "/api/v1/qqmusic/getcategory",
				/*分类专区 */
				areaData: {},
				activityData: {},
				dailyData: {},
				darenData: {},
				menuData: {}
			};
		},
		methods: {
			/**获取页面数据 */
			getCategoryData() {
				let that = this;
				this.isRequest = true;
				this.$axios.get(this.requestUrl).then(({ data }) => {
					that.isRequest = false;
					that.isInited = true;
					if (data.code !== 0) return;
					data.area.code === 0 && (that.areaData = data.area.data);
					data.daily.code === 0 && (that.dailyData = data.daily.data);

					data.daren.code === 0 && (that.darenData = data.daren.data);

					data.menu.code === 0 && (that.menuData = data.menu.data);
					data.activity.code === 0 && (that.activityData = data.activity.data);
				});
			},
			goPageArea(url) {
				let spt = url
					.split("https://y.qq.com/m/client/area/index.html?encArea=")[1]
					.split("&")[0];
				this.$router.push({
					path: "categoryarea/" + spt
				});
			},
			/**跳转列表页 */
			goPageSongsList(id) {
				this.$router.push({
					path: "songslist/" + id
				});
			},
			/**跳转分类页 */
			goPageCategory(id) {
				this.$router.push({
					path: "category/" + id
				});
			},
			/**数字转换 */
			convertNum(num) {
				let n = num.toString();
				let spt = n.split("");
				if (spt < 4) return n;
				let str = spt.slice(0, spt.length - 4).join("") + "万";
				return str;
			}
		},
		created() {
			this.getCategoryData();
		}
	};
</script>


<style lang="scss">
	.category-zone-container {
		height: 100%;
		width: 100%;
		position: relative;
		padding-top: 3rem;
		color: #000;
		.category-list-container {
			position: relative;
			height: 100%;
		}
	}
	.c-list-wrap {
		.c-l-tit {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 1.4em;
			padding: 0 1rem;
			> .more {
				font-size: 0.8rem;
				color: gray;
			}
		}
		.c-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 1rem;
			.c-l-item {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-basis: 30%;
				flex-grow: 1;
				background-color: #fff;
				margin: 0.2rem;
				padding: 0.3rem;
				border-radius: 0.3rem;
				.c-l-tit {
					font-size: 1rem;
				}
			}
		}
	}
	.cards-wrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0.5rem;
		.c-l-card {
			position: relative;
			flex-basis: 50%;
			padding: 0.5rem;
			.cover {
				position: relative;
				width: 100%;

				> img {
					display: block;
					max-width: 100%;
					border-radius: 10px;
				}
				.icon {
					display: flex;
					align-items: center;
					position: absolute;
					bottom: 0;
					right: 0;
					z-index: 2;
					font-size: 0.8rem;
					color: #fff;
					padding: 2px 6px;
					border-radius: 10px;
					background-color: rgba(0, 0, 0, 0.5);
					> .iconfont {
						font-size: 1em;
					}
				}
			}
		}

		.c-l-card-tit {
			font-size: 1rem;
			position: static;
			color: inherit;
		}
		.c-l-card-from {
			font-size: 0.8rem;
			color: gray;
		}
		.c-l-card-img {
			display: block;
			width: 100%;
			object-fit: cover;
			border-radius: 0.8rem;
			overflow: hidden;
			z-index: 1;
		}
	}
	.c-list-wrap.area {
		.c-l-card-tit {
			color: $bg-color;
			font-size: 1.2rem;
			position: absolute;
			left: 1.2rem;
			top: 1.2rem;
		}
	}
</style>
