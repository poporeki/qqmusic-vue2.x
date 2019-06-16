<template>
	<div class="all-category-container">
		<common-header title-color="0,0,0,1" :is-change-bg="false"></common-header>
		<div class="c-list-wrap" v-for="(list,lidx) in categoryList" :key="lidx">
			<div class="c-l-tit">
				<img :src="list.group_icon" alt>
				<span>{{list.group_name}}</span>
			</div>
			<div class="c-l-i-content">
				<div class="i-list">
					<div
						@click="goPageCategory(item.id)"
						class="i-l-item"
						v-for="(item,iidx) in list.v_item"
						:key="iidx"
					>{{item.name}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import commonHeader from "@/components/common/HeaderItem";
	export default {
		components: { commonHeader },
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getAllCategory",
				categoryList: []
			};
		},
		methods: {
			/**获取分类列表 */
			getCategoryList() {
				let that = this;
				this.$axios.get(this.requestUrl).then(({ data }) => {
					if (data.code !== 0) return;
					that.categoryList = data.categoryList.data.v_group;
				});
			},
			/**跳转分类页 */
			goPageCategory(id) {
				this.$router.push({
					path: "/category/" + id
				});
			}
		},
		created() {
			this.getCategoryList();
		}
	};
</script>

<style lang="scss">
	.all-category-container {
		padding-top: 3rem;
		.c-list-wrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin: 1rem 0;
			background-color: #fff;
			.c-l-tit {
				display: flex;
				align-items: center;
				flex-direction: column;
				text-align: center;
				font-size: 1.2rem;
				> img {
					max-width: inherit !important;
				}
			}
			.c-l-i-content {
				flex-grow: 1;
				.i-list {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					.i-l-item {
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid $base-bg-color;
						padding: 1rem 0;
						flex-grow: 1;
						flex-basis: 30%;
						font-size: 0.9em;
					}
				}
			}
		}
	}
</style>


