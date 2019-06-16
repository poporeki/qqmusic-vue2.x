<template>
	<div class="request-loading-list-container">
		<div class="inner">
			<div class="ani-item"></div>
			<div class="ani-item"></div>
			<div class="ani-item"></div>
			<div class="ani-item"></div>
			<div class="ani-item"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@keyframes itemAni {
		0% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1, 2);
		}
		100% {
			transform: scale(1, 1);
		}
	}
	.request-loading-list-container {
		position: relative;
		padding: 1rem 1rem;
		.inner {
			position: relative;
			display: flex;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			.ani-item {
				height: 1rem;
				width: 0.3rem;
				margin: 0.3rem;
				background-color: rgb(0, 0, 0);
				border-radius: 4px;
				box-shadow: 0 0 5px rgba(0, 0, 0, 0.178);
				animation: itemAni 1s infinite;
				&:nth-child(2) {
					animation-delay: 150ms;
				}
				&:nth-child(3) {
					animation-delay: 300ms;
				}
				&:nth-child(4) {
					animation-delay: 150ms;
				}
			}
		}
	}
</style>

