<template>
  <div>
    <MaterialNavigation />
    <ItemMain />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import ItemMain from "@/components/ItemMain";

export default {
  name: "Item",
  components: {
    MaterialNavigation,
    ItemMain,
  },
};
</script>
