<template>
  <div>
    <MaterialNavigation />
    <MaterialOrderList />
  </div>
</template>

<script>
import MaterialNavigation from "@/components/MaterialNavigation";
import MaterialOrderList from "@/components/MaterialOrderList";

export default {
  name: "MaterialOrder",
  components: {
    MaterialNavigation,
    MaterialOrderList,
  },
};
</script>
