<template>
  <div>
    <MaterialNavigation />
    <MaterialItemList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialItemList from "@/components/MaterialItemList";

export default {
  name: "MaterialItem",
  components: {
    MaterialNavigation,
    MaterialItemList,
  },
};
</script>
