<template functional>
    <a-sub-menu :key="props.menuInfo.key">
        <span slot="title">
          <a-icon :type="props.menuInfo.icon" /><span>{{ props.menuInfo.name }}</span>
        </span>
        <template v-for="item in props.menuInfo.children">
            <a-menu-item v-if="!item.children" :key="item.key">
                <router-link :to="{path:`${ item.url }`}" tag="a">
                    <a-icon :type="item.icon" />
                    <span>{{ item.name }}</span>
                </router-link>
            </a-menu-item>
            <subMenu-item v-else :key="item.key" :menu-info="item"></subMenu-item>
        </template>
    </a-sub-menu>

</template>

<script>
    export default {
        name: "SubMenu",
        props: ['menuInfo'],
    }
</script>

<style scoped>

</style>