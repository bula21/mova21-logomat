<template>
  <div>
    <MaterialNavigation />
    <MaterialItemList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";
import MaterialItemList from "@/components/material/MaterialItemList";

export default {
  name: "MaterialItem",
  components: {
    MaterialNavigation,
    MaterialItemList,
  },
};
</script>
