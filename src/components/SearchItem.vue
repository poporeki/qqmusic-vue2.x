<template>
	<transition enter-active-class="ani fade-in" leave-active-class="ani fade-out">
		<div class="search-bar-container" v-if="isShow">
			<div class="search-header header-container">
				<div class="btn-back" @click="thisClose">
					<i class="iconfont icon-arrowsleftline"></i>
				</div>
				<transition enter-active-class="ani fade-in-left delay-200">
					<div class="input-box" v-show="isShow">
						<i class="iconfont icon-search"></i>
						<input type="text" class="search-input" v-model="keywords" @keyup.enter="getSearchData">
					</div>
				</transition>
			</div>
			<div class="search-body">
				<div class="search-history">
					<div class="history-tit">
						<h4>搜索历史</h4>
						<div class="btn-remove" @click="deleteHistory">
							<i class="iconfont icon-lajitong"></i>
						</div>
					</div>
					<div class="history-list">
						<div
							class="history-list-item"
							v-for="(his,hidx) in  searchHistory"
							:key="hidx"
							@click="updateSearchText(his)"
						>{{his}}</div>
					</div>
				</div>

				<search-smart-box-item :keywords="keywords"></search-smart-box-item>
				<transition enter-active-class="ani move-in-bottom" leave-active-class="ani move-out-bottom">
					<div class="no-result" v-if="noResult">没有搜索到匹配的内容</div>
				</transition>
				<search-result-item
					v-show="isShowSearchResult"
					:data="searchResult"
					:isShow="isShowSearchResult"
				></search-result-item>
			</div>
		</div>
	</transition>
</template>


<script>
	import SearchResultItem from "@/components/SearchResultItem";
	import SearchSmartBoxItem from "@/components/SearchSmartBoxItem";
	export default {
		components: { SearchResultItem, SearchSmartBoxItem },
		data() {
			return {
				searchUrl: "/api/v1/qqmusic/search",
				keywords: "",
				isShowSearchResult: false,
				noResult: false,
				searchResult: {},
				smartBoxData: {
					album: {},
					mv: {},
					singer: {},
					song: {}
				}
			};
		},
		methods: {
			getSearchData(keywords) {
				let that = this;

				let kws = (typeof keywords !== "object" && keywords) || this.keywords;
				let params = {
					keywords: kws
				};
				this.$store.dispatch("pushSearchHistory", kws);
				this.$axios.get(this.searchUrl, { params }).then(({ data }) => {
					if (data.subcode === 10003) {
						that.noResult = true;
						return;
					}
					that.searchResult = data.data;
					that.isShowSearchResult = true;
				});
			},
			thisClose() {
				this.isShowSearchResult = false;
				return this.$store.commit("changeSearchBoxStatus", false);
			},
			deleteHistory() {
				return this.$store.commit("deleteSearchHistory");
			},
			updateSearchText(text) {
				this.keywords = text;
				this.getSearchData();
			}
		},
		computed: {
			searchHistory() {
				return this.$store.state.searchHistory;
			},
			isShow() {
				return this.$store.state.isShowSearchBox;
			}
		},
		watch: {
			keywords(val, oldVal) {
				if (this.isShowSearchResult && val !== oldVal) {
					this.isShowSearchResult = false;
				}
				if (!val || val === "" || val === null) {
					this.noResult = false;
					this.isShowSearchResult = false;
				}
			}
		}
	};
</script>


<style lang="scss">
	.search-bar-container {
		display: flex;
		flex-direction: column;

		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: $base-bg-color;
		z-index: 100;
		.btn-back {
			padding: 2px 10px;
			vertical-align: middle;
			display: flex;
			align-items: center;
		}
		.search-header {
			display: flex;
			flex-direction: row;
			.iconfont,
			input {
				font-size: 1.1rem;
			}
			.input-box {
				flex-grow: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 20px;
				padding: 0.3rem 0.7rem;
				background-color: $bg-color;
				box-sizing: border-box;
				border-radius: 50px 50px 50px 50px;
				.search-input {
					padding-left: 5px;
					border: 0;
					font-size: 1rem;
					outline: none;
				}
			}
		}
		.search-body {
			flex-grow: 1;
			position: relative;
			padding: 0 15px;
			box-sizing: border-box;
			.search-history {
				.history-tit {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
				}
				.btn-remove {
					> .iconfont {
						font-size: 1.1rem;
					}
				}
				.history-list {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					overflow: auto;
					.history-list-item {
						box-sizing: border-box;
						margin: 5px 10px;
						min-width: 35px;
						text-align: center;
						white-space: nowrap;
						border-radius: 50px;
						font-size: 0.9rem;
						padding: 5px 10px;
						border: 1px solid rgb(223, 223, 223);
					}
				}
			}
			.no-result {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				color: #000;
				font-size: 1.2rem;
				width: 100vw;
				height: 100%;
				left: 0;
				top: 0;
				background-color: #fff;
			}
		}
	}
</style>
