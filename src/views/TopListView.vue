<template>
	<page-scroll
		:data-list="toplistDetail"
		:song-list="toplistDetail.song"
		:cover-image="coverImage"
		:is-request="isRequest"
	></page-scroll>
</template>


<script>
	import pageScroll from "@/components/common/PageScroll";

	export default {
		components: { pageScroll },
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getonetoplist/",
				toplistDetail: {},
				coverImage: "",
				page: 1,
				limit: 20,
				isRequest: false
			};
		},
		methods: {
			/**获取排行榜数据 */
			getThisTopListData(ids) {
				let that = this;
				let id = ids || this.id;
				this.isRequest = true;
				this.$axios.get(this.requestUrl + id).then(({ data }) => {
					if (data.code !== 0) return;
					that.isRequest = false;
					that.toplistDetail = data.detail.data.data;
					that.coverImage = data.detail.data.data.mbHeadPicUrl;
				});
			}
		},
		computed: {
			/**排行榜id */
			id() {
				return this.$route.params.id;
			}
		},
		created() {
			this.getThisTopListData();
		}
	};
</script>


<style lang="scss">
	.tab-container {
		position: absolute;
		display: flex;
		top: 40%;
		height: 60%;
		width: 100%;
		flex-direction: column;
		.tab-head {
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.048);
			padding: 1rem;
			background-color: $bg-color;
			z-index: 2;
			.tab-head-item {
				&.active {
					color: $music-color;
					font-weight: bold;
				}
			}
		}
		.tab-body {
			flex-grow: 1;
			position: relative;
			background-color: $base-bg-color;
			overflow: hidden;
			height: 100%;
			z-index: 1;
			.tab-body-item {
				height: 100%;
				position: relative;
			}
		}
	}
</style>
