<template>
	<div class="header-container">
		<div class="item-name">{{$route.meta.title}}</div>
		<div class="search-bar" @click="showSearchBox">
			<i class="iconfont icon-search"></i>搜索
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			showSearchBox() {
				return this.$store.commit("changeSearchBoxStatus", true);
			}
		}
	};
</script>


<style lang="scss">
	.header-container {
		min-width: 100px;
		display: flex;
		position: relative;
		padding: 1rem;
		flex-direction: row;
		.item-name {
			color: #000;
			font-weight: bold;
			font-size: 1.5rem;
			padding-right: 40px;
		}
		.search-bar {
			position: relative;
			flex-grow: 1;
			background-color: $bg-color;
			border-radius: 50px 50px 50px 50px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			> .iconfont {
				font-size: 1rem;
			}
		}
	}
</style>

